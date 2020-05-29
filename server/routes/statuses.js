const express = require('express');
const statusController = require('../controllers/statuses');
const router = express.Router();

router.get('/', statusController.getStatuses);
router.get('/:id', statusController.getStatus);
router.post('/add', statusController.addStatus);
router.put('/:id', statusController.updateStatus);
router.delete('/:id', statusController.deleteStatus);

module.exports = router;