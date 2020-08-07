const Joi = require('joi');
const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    code: {
        type: String,
        minlength: 5,
        required: true
    },
    type: {
        type: String,
        enum: ['Procent', 'Kwota'],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    isInfinite: {
        type: Boolean,
        required: true
    },
    active: {
        type: Boolean
    },
    isSingleUse: {
        type: Boolean,

    },
    isSingleByUser: {
        type: Boolean,
    },
    usedBy: {
        type: Array,
        default: []
    },
    mustLogin: {
        type: Boolean,
        required: true
    },
    ID: {
        type: Number
    }


});

const Discount = mongoose.model('Discount', discountSchema);

function validateDiscount(discount) {
    const schema = {
        name: Joi.string().min(3).required(),
        code: Joi.string().min(5).required(),
        type: Joi.string().required(),
        value: Joi.number().required(),
        isInfinite: Joi.boolean().required(),
        active: Joi.boolean().required(),
        isSingleUse: Joi.boolean().required(),
        isSingleByUser: Joi.boolean().required(),
        usedBy: Joi.array(),
        mustLogin: Joi.boolean().required(),
        ID: Joi.number()
    };
    return Joi.validate(discount, schema)
}

exports.discountSchema = discountSchema;
exports.Discount = Discount;
exports.validateDiscount = validateDiscount;