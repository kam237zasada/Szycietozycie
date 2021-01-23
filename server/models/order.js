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
        type: Number
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
    comment: {
        type: String
    },
    privateComment: {
        type: String,
        default: ''
    },
    discountActive: {
        type: Boolean
    },
    discountUsed: {
        type: String
    },
    status: {
        type: statusSchema,
        required: true
    },
    messages: {
        type: Array,
        default: []
    },
    token: {
        type: String
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
        shipmentId: Joi.objectId().required(),
        paymentId: Joi.objectId().required(),
        cost: Joi.number().required(),
        statusID: Joi.number(),
        basketId: Joi.objectId(),
        comment: Joi.string().allow(""),
        privateComment: Joi.string().allow(""),
        messages: Joi.array(),
        shipmentCost: Joi.number(),
        discountActive: Joi.boolean(),
        discountUsed: Joi.string().allow("")

    };
    return Joi.validate(order, schema)
}

exports.orderSchema = orderSchema;
exports.Order = Order;
exports.validateOrder = validateOrder;