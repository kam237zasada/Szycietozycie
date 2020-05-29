const Joi = require('joi');
const mongoose = require('mongoose');


const basketSchema = new mongoose.Schema({
    products: {
        type: Array
    },
    cost: {
        type: Number,
    }
})

const Basket = mongoose.model("Basket", basketSchema);

function validateBasket(basket) {
    const schema = {
        products: Joi.array(),
        cost: Joi.number()
    };
    return Joi.validate(basket, schema);
};

exports.Basket = Basket;
exports.validateBasket = validateBasket;