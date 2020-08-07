const express = require('express');
const statusController = require('../controllers/statuses');
const router = express.Router();
const { accessTokenVerify } = require('../controllers/auth')

router.get('/', accessTokenVerify, statusController.getStatuses);
router.get('/:id', accessTokenVerify, statusController.getStatus);
router.post('/add', accessTokenVerify, statusController.addStatus);
router.put('/:id', accessTokenVerify, statusController.updateStatus);
router.delete('/:id', accessTokenVerify, statusController.deleteStatus);

module.exports = router;