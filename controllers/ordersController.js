const Order = require("../models/Order");
const Partner = require("../models/Partner");
const Assignment = require("../models/Assignment");

module.exports = {
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate("assignedTo", "name").exec();
      res.render("orders/allOrders", { allOrders: orders });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  },

  getAssignOrder: async (req, res) => {
    try {
      const partners = await Partner.find({});
      res.render("orders/addOrder", { partners });
    } catch (err) {
      console.error("Error fetching partners:", err);
      res.status(500).send("Server Error");
    }
  },

  postAssignOrder: async (req, res) => {
    const {
      orderNumber,
      customer,
      area,
      items,
      status,
      scheduledFor,
      assignedTo,
      totalAmount,
    } = req.body;

    try {
      // Ensure the partner exists (for assignedTo field)
      const partner = await Partner.findById(assignedTo);
      if (!partner) {
        return res.status(400).json({ message: "Partner not found" });
      }

      // Create a new order
      const newOrder = new Order({
        orderNumber,
        customer,
        area,
        items,
        status,
        scheduledFor,
        assignedTo,
        totalAmount,
      });

      // Save the order to the database
      await newOrder.save();

      if (newOrder.status == "assigned") {
        partner.currentLoad += 1;
        await partner.save();
        const assignment = new Assignment({
          orderId: newOrder._id,
          partnerId: partner._id,
          status: "assigned",
        });

        // Save the order to the database
        await assignment.save();
      }

      if (newOrder.status == "delivered") {
        partner.metrics.completedOrders += 1;
        await partner.save();

        const assignment = new Assignment({
          orderId: newOrder._id,
          partnerId: partner._id,
          status: "success",
        });

        // Save the order to the database
        await assignment.save();
      }
      // Send success response
      res.redirect("/api/orders");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getEditOrderStatus: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("assignedTo", "name")
        .exec();

      const partners = await Partner.find().exec();

      res.render("orders/editStatus.ejs", { order, partners });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  },

  putEditOrderStatus: async (req, res) => {
    const id = req.params.id;
    const { orderNumber, customer, status } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          orderNumber,
          customer,
          status,
        },
        { new: true, runValidators: true }
      );

      const partner = await Partner.findById(updatedOrder.assignedTo);

      if (status == "delivered") {
        partner.metrics.completedOrders += 1;
        if (partner.currentLoad) {
          partner.currentLoad -= 1;
        }
        await partner.save();

        const assignment = await Assignment.findOne({
          orderId: updatedOrder._id,
        });
        assignment.status = "success";
        await assignment.save();
      }

      if (status == "assigned") {
        partner.currentLoad += 1;
        await partner.save();

        const assignment = new Assignment({
          orderId: updatedOrder._id,
          partnerId: partner._id,
          status: "assigned",
        });

        // Save the order to the database
        await assignment.save();
      }

      res.redirect("/api/orders");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  deleteOrderStatus: async (req, res) => {
    const id = req.params.id;
    try {
      const order = await Order.findById(id);
      const partner = await Partner.findById(order.assignedTo);
      partner.metrics.cancelledOrders += 1;
      await partner.save();

      const assignment = await Assignment.findOne({ orderId: id });
      assignment.status = "failed";
      await assignment.save();

      await Order.findByIdAndDelete(id);
      res.redirect("/api/orders");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  },
};
