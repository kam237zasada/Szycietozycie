const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlenghth: 5,
        maxlenghth: 50,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255
    },
    confirmPassword: {
        type: String,
        minlength: 8,
        maxlength: 255
    },
    customerIdentities: {
        type: Object,
        default: {
            name: '',
            telephone: '',
            street: '',
            zipCode: '',
            city: ''
        }
    },
    companyIdentities: {
        type: Object,
        default: {
            companyName: '',
            street: '',
            zipCode: '',
            city: '',
            NIP: ''
        }
    },
    role: {
        type: String,
        default: "CUSTOMER"
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
    const schema = {
        login: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(100).email().required(),
        password: Joi.string().min(8).max(100).required(),
        confirmPassword: Joi.string().required()
    }
    return Joi.validate(customer, schema);
};

function validateData(customer) {
    const schema = {
        name: Joi.string().required(),
        street: Joi.string().required(),
        zipCode: Joi.string().regex(/\b\d{2}-\d{3}\b/).required(),
        city: Joi.string().required(),
        telephone: Joi.string().regex(/[0-9]/).required()
    }
    return Joi.validate(customer, schema);
};

function validateCompanyIdentities(customer) {
    const schema = {
        companyName: Joi.string().required(),
        companyStreet: Joi.string().required(),
        companyZipCode: Joi.string().regex(/\b\d{2}-\d{3}\b/).required(),
        companyCity: Joi.string().required(),
        companyNIP: Joi.string().regex(/[0-9]/).required()
    }
    return Joi.validate(customer, schema);
}

function validateCustomerUpdate(customer) {
    const schema = {
        login: Joi.string().min(6).max(50).required(),
        email: Joi.string().min(5).max(100).email().required()
    }
    return Joi.validate(customer, schema);
};

function validatePassword(customer) {
    const schema = {
        password: Joi.string().min(8).max(100).required(),
        confirmPassword: Joi.string().min(8).max(100).required(),
    }
    return Joi.validate(customer, schema);
};

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
exports.validateData = validateData;
exports.validateCompanyIdentities = validateCompanyIdentities;
exports.validateCustomerUpdate = validateCustomerUpdate;
exports.validatePassword = validatePassword;



