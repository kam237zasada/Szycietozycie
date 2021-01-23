const express = require('express');
const adminController = require('../controllers/admins');
const router = express.Router();
const { accessTokenVerify } = require('../controllers/auth')

router.get('/', accessTokenVerify, adminController.getAdmins);
router.get('/:id', accessTokenVerify, adminController.getAdmin);
router.post('/register', adminController.addAdmin);
router.post('/login', adminController.loginAdmin);
router.put('/:id', accessTokenVerify, adminController.updateAdmin);
router.put('/:id/password', accessTokenVerify, adminController.updatePassword);
router.delete('/:id', accessTokenVerify, adminController.deleteAdmin);

module.exports = router;