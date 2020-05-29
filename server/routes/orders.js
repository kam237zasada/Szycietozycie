const express = require('express');
const orderController = require('../controllers/orders');
const router = express.Router();

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.post('/add', orderController.addOrder);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:id', orderController.updateOrder);

module.exports = router;