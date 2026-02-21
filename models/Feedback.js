const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 and 5'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment']
    },
    givenBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: true
    },
    givenTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
