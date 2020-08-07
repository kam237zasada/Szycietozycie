const Joi = require('joi');
const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    data: {
        type: Object
    }
});

const Mail = mongoose.model('Mail', mailSchema);

function validateMail(mail) {
    const schema = {
        email: Joi.string().email().required(),
        data: Joi.object()
    };
    return Joi.validate(mail, schema)
}

exports.mailSchema = mailSchema;
exports.Mail = Mail;
exports.validateMail = validateMail;