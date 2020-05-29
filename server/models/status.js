const Joi = require('joi');
const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ID: {
        type: Number
    }
});

const Status = mongoose.model('Status', statusSchema);

function validateStatus(status) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        ID: Joi.number()
    };
    return Joi.validate(status, schema)
}

exports.statusSchema = statusSchema;
exports.Status = Status;
exports.validateStatus = validateStatus;