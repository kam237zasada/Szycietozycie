const Joi = require('joi');
const mongoose = require('mongoose');
const {categorySchema} = require('./category');

const Product = mongoose.model('Product', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: categorySchema,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    productCode: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    productImage: {
        type: String
    },
    dateAdded: {    
        type: Date,
        default: Date.now
    },
    ID: {
        type: Number
    }
}));

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(3).max(70).required(),
        categoryId: Joi.objectId().required(),
        color: Joi.string().required(),
        description: Joi.string().min(3).max(1000).required(),
        productCode: Joi.string().required(),
        price: Joi.number().min(0.01).required(),
        numberInStock: Joi.number().min(0).required(),
        productImage: Joi.string(),
        ID: Joi.number()
    };
    return Joi.validate(product, schema)
}

exports.Product = Product;
exports.validateProduct = validateProduct;
