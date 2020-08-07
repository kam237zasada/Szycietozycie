const express = require('express');
const categoryController = require('../controllers/categories');
const router = express.Router();
const { accessTokenVerify } = require('../controllers/auth')

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.post('/add', accessTokenVerify, categoryController.addCategory);
router.put('/:id', accessTokenVerify, categoryController.updateCategory);
router.delete('/:id', accessTokenVerify, categoryController.deleteCategory);

module.exports = router;