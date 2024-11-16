const Partner = require('../models/Partner');
const Order = require('../models/Order');
const Assignment = require('../models/Assignment');

module.exports = {
    getDashboardData: async (req, res) => {
        try {
            const partners = await Partner.find({});
            const orders = await Order.find({ status: "assigned" })
                .populate('assignedTo', 'name')
                .exec();
            const assignments = await Assignment.find()
                .populate('orderId', 'orderNumber')
                .populate('partnerId', 'name');
            res.render("dashboard.ejs", { partners, orders, assignments });
        } catch (error) {
            console.error(error);
        }
    }
};
