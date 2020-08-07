const express = require('express');
const siteController = require('../controllers/sites');
const router = express.Router();
const { accessTokenVerify } = require('../controllers/auth')

router.get('/', siteController.getSites);
router.get('/category/find/:category', siteController.getSitesByCategory)
router.get('/:id', siteController.getSite);
router.post('/add', accessTokenVerify, siteController.addSite);
router.put('/:id', accessTokenVerify, siteController.updateSite);
router.delete('/:id', accessTokenVerify, siteController.deleteSite);

module.exports = router;