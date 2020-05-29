const Joi = require('joi');
const mongoose = require('mongoose');
const {shipmentSchema} = require('./shipment');
const {paymentSchema} = require('./payment');
const {statusSchema} = require('./status');


const orderSchema = new mongoose.Schema({
    ID: {
        type: Number
    },
    customerIdentities: {
        type: Object,
        required: true
    },
    shipmentIdentities: {
        type: Object,
        required: true
    },
    invoiceIdentities: {
        type: Object
    },
    customer: {

    },
    products: {
        type: Array,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    shipment: {
        type: shipmentSchema,
        required: true
    },
    payment: {
        type: paymentSchema,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    status: {
        type: statusSchema,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
    const schema = {
        ID: Joi.number(),
        customerIdentities: Joi.object().required(),
        shipmentIdentities: Joi.object().required(),
        invoiceIdentities: Joi.object(),
        customer: Joi.object(),
        products: Joi.array().required(),
        dateAdded: Joi.date(),
        shipmentId: Joi.objectId().required(),
        paymentId: Joi.objectId().required(),
        value: Joi.number().required(),
        statusID: Joi.number(),
        basketId: Joi.objectId()

    };
    return Joi.validate(order, schema)
}

exports.ordertSchema = orderSchema;
exports.Order = Order;
exports.validateOrder = validateOrder;