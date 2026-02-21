const Feedback = require('../models/Feedback');
const mongoose = require('mongoose');

// Get all feedbacks
exports.getFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('givenBy', 'name email department')
            .populate('givenTo', 'name email department');

        res.status(200).json({ success: true, count: feedbacks.length, data: feedbacks });
    } catch (err) {
        next(err);
    }
};

// Create new feedback

exports.createFeedback = async (req, res, next) => {
    try {
        const { rating, comment, givenBy, givenTo } = req.body;

        // Basic validation
        if (!rating || !comment || !givenBy || !givenTo) {
            res.status(400);
            return next(new Error('Please provide all required fields'));
        }

        //  Cannot give feedback to self
        if (givenBy.toString() === givenTo.toString()) {
            res.status(400);
            return next(new Error('Cannot give feedback to self'));
        }

        // Prevent duplicate feedback within 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const existingFeedback = await Feedback.findOne({
            givenBy,
            givenTo,
            createdAt: { $gte: twentyFourHoursAgo }
        });

        if (existingFeedback) {
            res.status(400);
            return next(new Error('Cannot give feedback to the same employee more than once within 24 hours'));
        }

        const feedback = await Feedback.create(req.body);
        res.status(201).json({ success: true, data: feedback });
    } catch (err) {
        next(err);
    }
};

// feedbacks received by an employee

exports.getEmployeeFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find({ givenTo: req.params.id })
            .populate('givenBy', 'name email department')
            .populate('givenTo', 'name email department');

        res.status(200).json({ success: true, count: feedbacks.length, data: feedbacks });
    } catch (err) {
        next(err);
    }
};

//average feedback rating received by an employee

exports.getEmployeeAverageRating = async (req, res, next) => {
    try {
        const objId = new mongoose.Types.ObjectId(req.params.id);
        const average = await Feedback.aggregate([
            { $match: { givenTo: objId } },
            { $group: { _id: '$givenTo', averageRating: { $avg: '$rating' } } }
        ]);

        if (average.length === 0) {
            return res.status(200).json({ success: true, averageRating: 0 });
        }

        res.status(200).json({ success: true, averageRating: average[0].averageRating });
    } catch (err) {
        res.status(400);
        next(err);
    }
};

//   Delete a feedback

exports.deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            res.status(404);
            return next(new Error('Feedback not found'));
        }


        const requestorId = req.headers['employee-id'];

        if (!requestorId) {
            res.status(401);
            return next(new Error('Not authorized. employee-id in headers'));
        }

        if (feedback.givenBy.toString() !== requestorId) {
            res.status(403);
            return next(new Error('Not authorized to delete this feedback. Only the giver can delete.'));
        }

        await feedback.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
