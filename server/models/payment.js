const Joi = require('joi');
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ID: {
        type: Number
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

function validatePayment(payment) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        ID: Joi.number()
    };
    return Joi.validate(payment, schema)
}

exports.paymentSchema = paymentSchema;
exports.Payment = Payment;
exports.validatePayment = validatePayment;