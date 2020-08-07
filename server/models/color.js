const Joi = require('joi');
const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ID: {
        type: Number
    }
});

const Color = mongoose.model('Color', colorSchema);

function validateColor(color) {
    const schema = {
        name: Joi.string().min(2).max(50).required()
    };
    return Joi.validate(color, schema)
}

exports.colorSchema = colorSchema;
exports.Color = Color;
exports.validateColor = validateColor;