const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    department: {
        type: String,
        required: [true, 'Please add a department']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
