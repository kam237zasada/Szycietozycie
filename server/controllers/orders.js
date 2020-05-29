const express = require('express');
const {Order, validateOrder} = require('../models/order');
const {Product} = require('../models/product');
const {Shipment} = require('../models/shipment');
const {Payment} = require('../models/payment');
const {Basket} = require('../models/basket');
const {Status} = require('../models/status');


getOrder = async (req, res) => {
    let order = await Order.findOne({"ID": req.params.id});
    if(!order) { return res.status(400).send("Nie ma takiego zamówienia."); }

    res.send(order);
};

getOrders = async (req, res) => {
    const orders = await Order.find().sort('ID');
    

    res.send(orders);
}

addOrder = async (req, res) => {
    const { error } = validateOrder(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    
    let currentNumber;
    let orders = await Order.find();
    if(orders.length===0) { currentNumber = 1} else {
    let lastElementIndex = orders.length -1;
    currentNumber = orders[lastElementIndex].ID +1;
    }

    let shipment = await Shipment.findById(req.body.shipmentId)
    let payment = await Payment.findById(req.body.paymentId);
    let status = await Status.findOne({ID: req.body.statusID});

    let productsInBasket = req.body.products;

    for (let i=0; i<productsInBasket.length; i++) {
        let product = await Product.findOne({"_id": productsInBasket[i]._id})
        if(product.numberInStock < productsInBasket[i].amount) {
            return res.status(400).send(`Nie ma tyle produktów na stanie!, zostało ich tylko ${product.numberInStock}`)
        }
        product.numberInStock -= productsInBasket[i].amount;
        try {
            await product.save();
        } catch (err) {
            return res.status(400).send(err)
        }
    }

    


    let customer = req.body.customer;
    if(customer.name==="") {
        customer = "Niezarejestrowany"
    }


    const newOrder = new Order({
        customerIdentities: req.body.customerIdentities,
        shipmentIdentities: req.body.shipmentIdentities,
        invoiceIdentities: req.body.invoiceIdentities,
        customer: customer,
        products: req.body.products,
        shipment: shipment,
        payment: payment,
        ID: currentNumber,
        value: req.body.value,
        status: status
    });
    try {
        await newOrder.save();
        res.send({
            message: "Zostało złożone zamówienie.",
            newOrder
        })
        let basket = await Basket.findByIdAndDelete(req.body.basketId);
            if(!basket) { return res.status(400).send("Koszyk nie istnieje.")};

    } catch (error) { return res.status(400).send(error) };
};

updateOrderStatus = async (req,res) => {
    let order = await Order.findOne({"_id": req.params.id})
    if(!order) { return res.status(400).send("Takie zamówienie nie istnieje.")}

    let status = await Status.findOne({"ID": req.body.statusID});
    if(!status) { return res.status(400).send("Taki status nie istnieje.")}

    order.status = status;
    
    try {
        await order.save();
        res.send({
            message: "Status zmieniony"
        })
    } catch (err) {
        return res.status(400).send(err)
    }

}

updateOrder = async (req, res) => {
    // const product = await Product.findById(req.params.id);
    // if(!product) { return res.status(400).send("Taki produkt nie istnieje."); };

    // let findCode = await Product.findOne({productCode: req.body.productCode});

    // if(findCode && findCode._id != req.params.id) {
    //     return res.status(400).send('Produkt o takim kodzie juz istnieje, podaj inny kod produktu.');
    // }
    

    // if(error) { return res.status(400).send(error.details[0].message)};
    // let price = req.body.price;
    // let z = price.toString();

    // let x = z.indexOf(".");
    //             let string = z.substr(x)
    //             if (string.length > 3)
    //             { return res.status(400).send("Błędny format ceny")};
    // product.set({
    //     name: req.body.name,
    //     category: {
    //         name: category.name,
    //         _id: category._id,
    //         ID: category.ID
    //     },
    //     color: req.body.color,
    //     description: req.body.description,
    //     productCode: req.body.productCode,
    //     price: req.body.price,
    //     numberInStock: req.body.numberInStock,
    //     productImage: req.body.productImage

    // });
    // try {
    //     await product.save();
    //     res.send({
    //         product,
    //         message: "Produkt poprawnie zauktualizowany."});
    // } catch (error) { res.status(400).send(error); }
};

module.exports = {getOrder, getOrders, addOrder, updateOrderStatus, updateOrder};