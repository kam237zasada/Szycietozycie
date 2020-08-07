const express = require('express');
const orderController = require('../controllers/orders');
const router = express.Router();
const { accessTokenVerify, accessTokenVerifyCustomer } = require('../controllers/auth')

router.get('/page/:page', accessTokenVerify, orderController.getOrders);
router.get('/new/page/:page', accessTokenVerify, orderController.getNewOrders);
router.get('/open/page/:page', accessTokenVerify, orderController.getOpenOrders);
router.get('/finalized/page/:page', accessTokenVerify, orderController.getFinalizedOrders);
router.get('/search/:status/:query/page/:page', accessTokenVerify, orderController.getOrdersByQuery);
router.get('/single-order/:accessToken', orderController.getSingleOrder);
router.get('/:id', accessTokenVerify, orderController.getOrder);
router.get('/customer/:id', accessTokenVerifyCustomer, orderController.getOrdersByClient);
router.post('/add', orderController.addOrder);
router.put('/:id/status', accessTokenVerify, orderController.updateOrderStatus);
router.put('/:id', accessTokenVerify, orderController.updateOrder);
router.put('/privcmnt/:id', accessTokenVerify, orderController.updatePrivateComment)
router.put('/messages/:id', accessTokenVerify, orderController.updateMessages);

module.exports = router;