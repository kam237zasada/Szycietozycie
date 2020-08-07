const express = require('express');
const paymentController = require('../controllers/payments');
const router = express.Router();
const { accessTokenVerify } = require('../controllers/auth')

router.get('/', paymentController.getPayments);
router.get('/:id', paymentController.getPayment);
router.post('/add', accessTokenVerify, paymentController.addPayment);
router.put('/:id', accessTokenVerify, paymentController.updatePayment);
router.delete('/:id', accessTokenVerify, paymentController.deletePayment);

module.exports = router;