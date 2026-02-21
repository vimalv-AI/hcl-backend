const Employee = require('../models/Employee');
const Feedback = require('../models/Feedback'); // Needed to delete associated feedback


exports.getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find();
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (err) {
        next(err);
    }
};


exports.createEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (err) {
        res.status(400);
        next(err);
    }
};

exports.deleteEmployee = async (req, res, next) => {
    try {
        const employeeId = req.params.id;

        // Find and delete the employee
        const employee = await Employee.findByIdAndDelete(employeeId);

        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }

        // Delete all feedback associated with this employee (both given and received)
        await Feedback.deleteMany({
            $or: [{ givenTo: employeeId }, { givenBy: employeeId }]
        });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400);
        next(err);
    }
};
