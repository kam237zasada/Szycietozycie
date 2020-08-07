const Joi = require('joi');
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    values: {
        type: Array
    },
    ID: {
        type: Number
    }
});

const Variant = mongoose.model('Variant', variantSchema);

function validateVariant(variant) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        values: Joi.array().required(),
        ID: Joi.number()
    };
    return Joi.validate(variant, schema)
}

exports.variantSchema = variantSchema;
exports.Variant = Variant;
exports.validateVariant = validateVariant;