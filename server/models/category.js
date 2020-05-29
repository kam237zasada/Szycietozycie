const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ID: {
        type: Number
    }
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        ID: Joi.number()
    };
    return Joi.validate(category, schema)
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validateCategory = validateCategory;