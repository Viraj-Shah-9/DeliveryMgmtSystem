const Assignment = require('../models/Assignment.js');

module.exports = {
    getAllAssignments: async (req, res) => {
        try {
            const assignments = await Assignment.find().populate('orderId', 'orderNumber').populate('partnerId', 'name');
            res.render("assignments/allAssignments.ejs", { assignments });
        } catch (error) {
            console.error(error);
        }
    }
};
