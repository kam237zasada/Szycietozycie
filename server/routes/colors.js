const express = require('express');
const colorController = require('../controllers/colors');
const router = express.Router();
const { accessTokenVerify } = require('../controllers/auth')

router.get('/', accessTokenVerify, colorController.getColors);
router.get('/:id', accessTokenVerify, colorController.getColor);
router.post('/add', accessTokenVerify, colorController.addColor);
router.put('/:id', accessTokenVerify, colorController.updateColor);
router.delete('/:id', accessTokenVerify, colorController.deleteColor);

module.exports = router;