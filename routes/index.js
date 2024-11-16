const express = require('express');
const router = express.Router();
const partnersController = require('../controllers/partnersController');
const ordersController = require('../controllers/ordersController');
const assignmentsController = require('../controllers/assignmentController');
const dashboardController = require('../controllers/dashboardController');

// Partner Routes
router.get('/api/partners', partnersController.getAllPartners);
router.get('/api/addPartner', partnersController.getAddPartner);
router.post('/api/partners', partnersController.postAddPartner);
router.get('/api/partner/:id', partnersController.getEditPartner);
router.put('/api/partner/:id', partnersController.putEditPartner);
router.delete('/api/partner/:id', partnersController.deletePartner);

// Order Routes
router.get("/api/orders", ordersController.getAllOrders);
router.get("/api/orders/assign", ordersController.getAssignOrder);
router.post("/api/orders/assign", ordersController.postAssignOrder);
router.get("/api/orders/:id/status", ordersController.getEditOrderStatus);
router.put("/api/orders/:id/status", ordersController.putEditOrderStatus);
router.delete("/api/orders/:id/status", ordersController.deleteOrderStatus);

// Assignment Routes
router.get("/api/assignments", assignmentsController.getAllAssignments);

// Dashboard Routes
router.get("/", dashboardController.getDashboardData);

module.exports = router;
