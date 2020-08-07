const Joi = require('joi');
const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    ID: {
        type: Number
    },
    category: {
        type: String,
        enum: ["Regulaminy", "Zakupy", "O firmie"],
        required: true
    }
});

const Site = mongoose.model('Site', siteSchema);

function validateSite(site) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        content: Joi.string().required(),
        ID: Joi.number(),
        category: Joi.string().required()
    };
    return Joi.validate(site, schema)
}

exports.siteSchema = siteSchema;
exports.Site = Site;
exports.validateSite = validateSite;