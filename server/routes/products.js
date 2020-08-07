const express = require('express');
const productController = require('../controllers/products');
const router = express.Router();
const multer = require('multer');
const { accessTokenVerify } = require('../controllers/auth');
const { response } = require('express');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
    
});


const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
    } else {
        cb(new Error('przesłany plik nie jest obrazem'), false);
    }
};
const upload = multer({storage: storage, fileFilter: fileFilter});


router.get('/', productController.getAllProducts);
router.get('/pricefrom=:priceA/priceto=:priceB/sortBy=:sort/page/:page', productController.getProducts);
router.get('/category/:categoryId/pricefrom=:priceA/priceto=:priceB/sortBy=:sort/page/:page', productController.getProductsByCategory);
router.get('/query/:query/pricefrom=:priceA/priceto=:priceB/sortBy=:sort/page/:page', productController.getProductsByQuery);
router.get('/:id', productController.getProduct);
router.get('/filter/query=:query/category=:categoryId/pricefrom=:priceA/priceto=:priceB/sortBy=:sort/page/:page', productController.getProductsByFilters)
router.get('/sort/:sortValue/page/:page', productController.sortProducts);
router.get('/show/popular', productController.getPopularProducts);
router.post('/add', accessTokenVerify, productController.addProduct);
router.put('/:id', accessTokenVerify, productController.updateProduct);
router.put('/price/:id', accessTokenVerify, productController.updatePrice);
router.put('/stock/:id', accessTokenVerify, productController.updateStock);
router.put('/v/views/:id', productController.addView)
router.delete('/:id', accessTokenVerify, productController.deleteProduct);
router.post('/uploads', accessTokenVerify, upload.single('productImage'), productController.fileUpload);
module.exports = router;