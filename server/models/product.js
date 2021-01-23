const Joi = require('joi');
const mongoose = require('mongoose');
const {categorySchema} = require('./category');
const {variantSchema} = require('./variant');
const {colorSchema} = require('./color');

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
        type: Array
    },
    shortDescription: {
        type: String,
        maxlength: 150
    },
    description: {
        type: String
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
        type: Array
    },
    shipmentTime: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    },
    alternatives: {
        type: Array
    },
    dateAdded: {    
        type: Number
    },
    variant: {
        type: Object,
    },
    views: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    ID: {
        type: Number
    }
}));

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(3).max(70).required(),
        categoryId: Joi.objectId().required(),
        color: Joi.array(),
        shortDescription: Joi.string().allow(''),
        description: Joi.string().allow(''),
        productCode: Joi.string().required(),
        price: Joi.number().min(0.01).required(),
        numberInStock: Joi.number().min(0).required(),
        productImage: Joi.array(),
        shipmentTime: Joi.string().required(),
        tags: Joi.array(),
        alternatives: Joi.array(),
        variantId: Joi.string().allow(''),
        ID: Joi.number()
    };
    return Joi.validate(product, schema)
}

exports.Product = Product;
exports.validateProduct = validateProduct;
