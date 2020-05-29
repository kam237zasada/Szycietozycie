const express = require('express');
const paymentController = require('../controllers/payments');
const router = express.Router();

router.get('/', paymentController.getPayments);
router.get('/:id', paymentController.getPayment);
router.post('/add', paymentController.addPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;