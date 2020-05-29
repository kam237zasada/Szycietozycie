const express = require('express');
const basketController = require('../controllers/baskets');
const router = express.Router();

router.get('/', basketController.getBaskets);
router.get('/:id', basketController.getBasket);
router.post('/add', basketController.addBasket);
router.put('/:id', basketController.updateBasket);
router.delete('/:id', basketController.deleteBasket);

module.exports = router;