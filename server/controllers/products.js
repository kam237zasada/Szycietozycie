const express = require('express');
const {Product, validateProduct} = require('../models/product');
const {Category} = require('../models/category');


getProduct = async (req, res) => {
    let product = await Product.findOne({"ID": req.params.id});
    if(!product) { return res.status(400).send("Produkt nie istnieje."); }

    res.send(product);
};

getProducts = async (req, res) => {
    const products = await Product.find().sort('dateAdded');
    let number = products.length +1;
    products.code = number;

    res.send(products);
}

getProductsByCategory = async (req, res) => {
    const category = await Category.findOne({"ID": req.params.id});
    const categoryId = category._id;
    const products = await Product.find({"category._id": categoryId});
    if(!products) { return res.status(400).send("Brak produktów w wybranej kategorii") }
    res.send(products);
}

getProductsByQuery = async (req, res) => {
    const query = req.params.query;
    const upperQuery = query.toUpperCase();
    const lowerQuery = query.toLowerCase();
    const firstUpperQuery = query.charAt(0).toUpperCase() + query.slice(1);
    const reg = new RegExp(query);

    const products = await Product.find().or([{name: reg}, {name: query}, {name: upperQuery}, {name: lowerQuery}, {name: firstUpperQuery}, {color: query}, {color: upperQuery}, {color: lowerQuery}, {color: firstUpperQuery}]);
    if(!products) { return res.status(400).send("Brak produktów.") }
    res.send(products);
}

addProduct = async (req, res, next) => {
    const { error } = validateProduct(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let findCode = await Product.findOne({productCode: req.body.productCode});

    if(findCode) {
        return res.status(400).send('Produkt o takim kodzie już istnieje, podaj inny kod produktu.');
    }
    let currentNumber;
    let products = await Product.find();
    if(products.length===0) { currentNumber = 1} else {
    let lastElementIndex = products.length -1;
    currentNumber = products[lastElementIndex].ID +1;
    }


    const category = await Category.findById(req.body.categoryId);
    if(!category) { return res.status(400).send("Taka kategoria nie istnieje"); }
    let price = req.body.price;
    let z = price.toString();

    let x = z.indexOf(".");
                let string = z.substr(x)
                if (string.length > 3)
                { return res.status(400).send("Błędny format ceny")};
    const newProduct = new Product({
        name: req.body.name,
        category: {
            name: category.name,
            _id: category._id,
            ID: category.ID
        },
        color: req.body.color,
        description: req.body.description,
        productCode: req.body.productCode,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        productImage: req.body.productImage,
        ID: currentNumber
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
    let price = req.body.price;
    let z = price.toString();

    let x = z.indexOf(".");
                let string = z.substr(x)
                if (string.length > 3)
                { return res.status(400).send("Błędny format ceny")};
    product.set({
        name: req.body.name,
        category: {
            name: category.name,
            _id: category._id,
            ID: category.ID
        },
        color: req.body.color,
        description: req.body.description,
        productCode: req.body.productCode,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        productImage: req.body.productImage

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

fileUpload = async (req, res) => {
    const file = req.file;

    res.json({filePath: "http://localhost:3000/product/" + file.path
    })
    console.log(req.file)
}

module.exports = {getProduct, getProducts, getProductsByCategory, getProductsByQuery, addProduct, updateProduct, deleteProduct, fileUpload};