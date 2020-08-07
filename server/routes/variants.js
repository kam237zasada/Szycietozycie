const express = require('express');
const variantController = require('../controllers/variants');
const router = express.Router();
const { accessTokenVerify } = require('../controllers/auth')

router.get('/', accessTokenVerify, variantController.getVariants);
router.get('/:id', accessTokenVerify, variantController.getVariant);
router.post('/add', accessTokenVerify, variantController.addVariant);
router.put('/:id', accessTokenVerify, variantController.updateVariant);
router.delete('/:id/:IDD', accessTokenVerify, variantController.deleteVariant);

module.exports = router;