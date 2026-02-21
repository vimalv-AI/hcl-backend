const express = require('express');
const {
    getFeedbacks,
    createFeedback,
    getEmployeeFeedbacks,
    getEmployeeAverageRating,
    deleteFeedback
} = require('../controllers/feedbackController');

const router = express.Router();

router.route('/').get(getFeedbacks).post(createFeedback);

router.route('/:id').delete(deleteFeedback);

router.route('/employee/:id').get(getEmployeeFeedbacks);

router.route('/employee/:id/average').get(getEmployeeAverageRating);

module.exports = router;
