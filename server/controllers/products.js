const express = require('express');
const {Product, validateProduct} = require('../models/product');
const {Category} = require('../models/category');


getProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) { return res.status(400).send("Produkt nie istnieje."); }

    res.send(product);
};

getProducts = async (req, res) => {
    const products = await Product.find().sort('dateAdded');

    res.send(products);
}
addProduct = async (req, res) => {
    const { error } = validateProduct(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let findCode = await Product.findOne({productCode: req.body.productCode});

    if(findCode) {
        return res.status(400).send('Produkt o takim kodzie juz istnieje, podaj inny kod produktu.');
    }

    const category = await Category.findById(req.body.categoryId);
    if(!category) { return res.status(400).send("Taka kategoria nie istnieje"); }

    const newProduct = new Product({
        name: req.body.name,
        category: {
            name: category.name,
            _id: category._id
        },
        color: req.body.color,
        description: req.body.description,
        productCode: req.body.productCode,
        price: req.body.price,
        numberInStock: req.body.numberInStock
    });
    try {
        await newProduct.save();
        res.send({
            message: "Nowy produkt dodany prawidłowo.",
            newProduct
        })

    } catch (error) { return res.status(400).send(error) };
};

updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) { return res.status(400).send("Taki produkt nie istnieje."); };

    let findCode = await Product.findOne({productCode: req.body.productCode});

    if(findCode && findCode._id != req.params.id) {
        return res.status(400).send('Produkt o takim kodzie juz istnieje, podaj inny kod produktu.');
    }
    const category = await Category.findById(req.body.categoryId);
    if(!category) { return res.status(400).send("Taka kategoria nie istnieje"); }

    const { error } = validateProduct(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};



    product.set({
        name: req.body.name,
        category: {
            name: category.name,
            _id: category._id
        },
        color: req.body.color,
        description: req.body.description,
        productCode: req.body.productCode,
        price: req.body.price,
        numberInStock: req.body.numberInStock
    });
    try {
        await product.save();
        res.send({
            product,
            message: "Produkt poprawnie zauktualizowany."});
    } catch (error) { res.status(400).send(error); }
};

deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) { return res.status(400).send("Taki produkt nie istnieje."); };

    res.send({ message: `Produkt ${product.name} o ID ${req.params.id} usunięty poprawnie.` });

}

module.exports = {getProduct, getProducts, addProduct, updateProduct, deleteProduct};