const express = require('express');
const mailController = require('../controllers/mails');
const router = express.Router();
const { accessTokenVerify } = require('../controllers/auth')

router.post('/order_message', accessTokenVerify, mailController.orderMessage);
router.post('/product_question', mailController.productQuestion);

module.exports = router;