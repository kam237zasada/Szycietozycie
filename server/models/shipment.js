const Joi = require('joi');
const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ID: {
        type: Number
    },
    freeShipment: {
        type: String
    },
    payments: {
        type: Array,
        required:true
    }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

function validateShipment(shipment) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        price: Joi.number().required(),
        ID: Joi.number(),
        freeShipment: Joi.string().allow(''),
        payments: Joi.array().required()
    };
    return Joi.validate(shipment, schema)
}

exports.shipmentSchema = shipmentSchema;
exports.Shipment = Shipment;
exports.validateShipment = validateShipment;