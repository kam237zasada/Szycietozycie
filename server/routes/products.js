const express = require('express');
const productController = require('../controllers/products');
const router = express.Router();
const multer = require('multer');

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


router.get('/', productController.getProducts);
router.get('/category/:id', productController.getProductsByCategory);
router.get('/query/:query', productController.getProductsByQuery);
router.get('/:id', productController.getProduct);
router.post('/add', productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/uploads', upload.single('productImage'), productController.fileUpload);
module.exports = router;