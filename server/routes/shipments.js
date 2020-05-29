const express = require('express');
const shipmentController = require('../controllers/shipments');
const router = express.Router();

router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipment);
router.post('/add', shipmentController.addShipment);
router.put('/:id', shipmentController.updateShipment);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;