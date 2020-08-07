const express = require('express');
const customerController = require('../controllers/customers');
const router = express.Router();
const { accessTokenVerify, accessTokenVerifyCustomer } = require('../controllers/auth')


router.get('/page/:page', accessTokenVerify, customerController.getCustomers);
router.get('/edit/:id', accessTokenVerifyCustomer, customerController.getCustomer);
router.get('/query/:query/page/:page', accessTokenVerify, customerController.getCustomersByQuery);
router.post('/register', customerController.addCustomer);
router.post('/login', customerController.loginCustomer);
router.post('/password/reminder', customerController.passwordReminder);
router.put('/edit/password/:id', accessTokenVerifyCustomer, customerController.newPassword);
router.put('/:id/data', accessTokenVerifyCustomer, customerController.updateData);
router.put('/:id/invoice', accessTokenVerifyCustomer, customerController.updateInvoice);
router.put('/:id', accessTokenVerifyCustomer, customerController.updateCustomer);
router.put('/:id/password', accessTokenVerifyCustomer, customerController.updatePassword);
router.delete('/:id', accessTokenVerify, customerController.deleteCustomer);

module.exports = router;