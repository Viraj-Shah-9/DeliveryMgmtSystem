const Partner = require("../models/Partner");

module.exports = {
  // Get all partners
  getAllPartners: async (req, res) => {
    try {
      const allPartners = await Partner.find({});
      res.render("partners/allPartners.ejs", { allPartners });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Add a new partner
  getAddPartner: (req, res) => {
    res.render("partners/addPartner.ejs");
  },

  postAddPartner: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        status,
        areas,
        shift_start,
        shift_end,
        rating,
        completedOrders,
        cancelledOrders,
      } = req.body;

      if (!name || !email || !phone || !status || !shift_start || !shift_end) {
        return res
          .status(400)
          .json({ error: "All required fields must be provided." });
      }

      const newPartner = new Partner({
        name,
        email,
        phone,
        status,
        areas: areas ? areas.split(",").map((area) => area.trim()) : [], // Convert comma-separated areas to an array
        shift: {
          start: shift_start,
          end: shift_end,
        },
        metrics: {
          rating,
          completedOrders,
          cancelledOrders,
        },
      });

      const savedPartner = await newPartner.save();
      console.log(savedPartner);
      res.redirect("/api/partners");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getEditPartner: async (req, res) => {
    try {
      const id = req.params.id;
      const partner = await Partner.findById(id);
      res.render("partners/editPartner.ejs", { partner });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  putEditPartner: async (req, res) => {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      status,
      areas,
      shift_start,
      shift_end,
      rating,
      completedOrders,
      cancelledOrders,
    } = req.body;

    try {
      // Validate ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid partner ID" });
      }

      // Update partner details
      const updatedPartner = await Partner.findByIdAndUpdate(
        id,
        {
          name,
          email,
          phone,
          status,
          areas: areas.split(",").map((area) => area.trim()), // Convert comma-separated string to array
          shift: { start: shift_start, end: shift_end },
          metrics: {
            rating,
            completedOrders,
            cancelledOrders,
          },
        },
        { new: true, runValidators: true } // Return updated document and validate
      );

      // Check if partner exists
      if (!updatedPartner) {
        return res.status(404).json({ error: "Partner not found" });
      }
      res.redirect("/api/partners");
    } catch (error) {
      console.error("Error updating partner:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the partner" });
    }
  },

  deletePartner: async (req, res) => {
    try {
      const id = req.params.id;
      const partner = await Partner.findByIdAndDelete(id);
      res.redirect("/api/partners");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
