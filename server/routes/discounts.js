const express = require('express');
const discountController = require('../controllers/discounts');
const router = express.Router();
const { accessTokenVerify } = require('../controllers/auth')

router.get('/', accessTokenVerify, discountController.getDiscounts);
router.get('/:id',accessTokenVerify,  discountController.getDiscount);
router.post('/check/:code', discountController.checkDiscount);
router.post('/add', accessTokenVerify, discountController.addDiscount);
router.put('/:id', accessTokenVerify, discountController.updateDiscount);
router.delete('/:id', accessTokenVerify, discountController.deleteDiscount);

module.exports = router;