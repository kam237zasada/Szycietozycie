const express = require('express');
const shipmentController = require('../controllers/shipments');
const router = express.Router();
const { accessTokenVerify } = require('../controllers/auth')

router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipment);
router.post('/add', accessTokenVerify, shipmentController.addShipment);
router.put('/:id', accessTokenVerify, shipmentController.updateShipment);
router.delete('/:id', accessTokenVerify, shipmentController.deleteShipment);

module.exports = router;