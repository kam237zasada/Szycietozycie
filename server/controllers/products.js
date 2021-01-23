const express = require('express');
const {Product, validateProduct} = require('../models/product');
const {Category} = require('../models/category');
const {Basket} = require('../models/basket');
const {Variant} = require('../models/variant');
const {Color} = require('../models/color');
const { getDate } = require('../js/index');
const { baseURL } = require('../config');


getProduct = async (req, res) => {
    let product = await Product.findOne({"ID": req.params.id});
    if(!product) { return res.status(400).send("Produkt nie istnieje."); }

    res.send(product);
};

getAllProducts = async (req, res) => {
    const products = await Product.find().sort('dateAdded');
    if(!products) { return res.status(400).send("Brak produktów")};

    res.send(products)
}

getProducts = async (req, res) => {
    let page = Number(req.params.page);
    let limit = 20;
    let skip = limit * (page-1);
    let allProducts;
    let products;
    if(req.params.priceA==0 && req.params.priceB==0) {
        allProducts = await Product.find().sort(req.params.sort);
        products = await Product.find().sort(req.params.sort).skip(skip).limit(limit);
    } else if(req.params.priceB==0) {
        allProducts = await Product.find({
            "price": {
                "$gte":req.params.priceA
            }
        }).sort(req.params.sort);
        products = await Product.find({
            "price": {
                "$gte": req.params.priceA
            }
        }).sort(req.params.sort).skip(skip).limit(limit);
    } else {
        allProducts = await Product.find({
            "price": {
                "$gte": req.params.priceA,
                "$lte": req.params.priceB
            }
        }).sort(req.params.sort);
        products = await Product.find({
            "price": {
                "$gte": req.params.priceA,
                "$lte": req.params.priceB
            }
            }).sort(req.params.sort).skip(skip).limit(limit);
    }
    
    if(!products) { return res.status(400).send("Brak produktów")};
    let number = products.length +1;
    products.code = number;

    res.send({
        products: products,
        length: allProducts.length
    });
}

getProductsByCategory = async (req, res) => {
    let page = Number(req.params.page);
    let limit = 20;
    let skip = limit * (page-1);
    const category = await Category.findOne({"ID": req.params.categoryId});
    const categoryId = category._id;
    let allProducts;
    let products;
    if(req.params.priceA==0 && req.params.priceB==0) {
    allProducts = await Product.find(({"category._id": categoryId}))
    products = await Product.find({"category._id": categoryId}).sort(req.params.sort).skip(skip).limit(limit);
    } else if(req.params.priceB==0) {
        allProducts = await Product.find(
            {"category._id": categoryId, 
            "price": { "$gte": req.params.priceA}}
            )
        products = await Product.find(
            {"category._id": categoryId,
            "price": { "$gte": req.params.priceA}
            })
        .sort(req.params.sort).skip(skip).limit(limit);
    } else {
        allProducts = await Product.find(
            {"category._id": categoryId, 
            "price": { 
                "$gte": req.params.priceA,
                "$lte": req.params.priceB
                }}
            )
        products = await Product.find(
            {"category._id": categoryId,
            "price": { 
                "$gte": req.params.priceA,
                "$lte": req.params.priceB
                }
            })
        .sort(req.params.sort).skip(skip).limit(limit);
    }
    if(!products) { return res.status(400).send("Brak produktów w wybranej kategorii") }
    
    res.send({
        products: products,
        length: allProducts.length
    });
}

getProductsByQuery = async (req, res) => {
    let page = Number(req.params.page);
    let query = req.params.query;
    const reg = new RegExp(query, "i");
    let products;
    if(req.params.priceA==0 && req.params.priceB==0) {
    products = await Product.find().or([
        {"name": { $regex: reg}},
        {"color": { "$elemMatch": {"name": {$regex: reg}}}},
        {"productCode": { $regex: reg}},
        {"tags": query},
        {"alternatives": query}
    ]).sort(req.params.sort)

} else if(req.params.priceB==0) {
    products = await Product.find({"price": {
        "$gte": req.params.priceA
    }}).or([
        {"name": { $regex: reg}},
        {"color": { "$elemMatch": {"name": {$regex: reg}}}},
        {"productCode": { $regex: reg}},
        {"tags": query},
        {"alternatives": query}
    ]).sort(req.params.sort)
} else {
    products = await Product.find({
        "price": {
            "$gte": req.params.priceA,
            "$lte": req.params.priceB
        }
    }).or([
        {"name": { $regex: reg}},
        {"color": { "$elemMatch": {"name": {$regex: reg}}}},
        {"productCode": { $regex: reg}},
        {"tags": query},
        {"alternatives": query}
    ]).sort(req.params.sort)
}
    if(!products) { return res.status(400).send("Brak produktów.") }

    let length = products.length;
    let limit = 20;
    let skip = limit * (page-1);
    products.splice(0, skip);
    products.splice(limit, (products.length-limit));

    res.send({
        products: products,
        length: length
    });
}

getProductsByFilters = async (req, res) => {
    let page = Number(req.params.page);
    let priceA = Number(req.params.priceA);
    let priceB = Number(req.params.priceB);
    let sort = req.params.sort;
    let query = req.params.query;
    const reg = new RegExp(query, "i");
    let limit = 20;
    let skip = limit * (page-1);
    let products = [];

    if(query!="allProducts") {
        if(req.params.categoryId=="all") {
            if(priceA==0 && priceB==0) {
                products = await Product.find().or([
                    {"name": { $regex: reg}},
                    {"color": { "$elemMatch": {"name": {$regex: reg}}}},
                    {"productCode": { $regex: reg}},
                    {"tags": query},
                    {"alternatives": query}
                ]).sort(sort)
            } else if(priceB==0) {
                products = await Product.find({
                    "price": {
                        "$gte": priceA
                    }
                }).or([
                    {"name": { $regex: reg}},
                    {"color": { "$elemMatch": {"name": {$regex: reg}}}},
                    {"productCode": { $regex: reg}},
                    {"tags": query},
                    {"alternatives": query}
                ]).sort(sort)
            } else {
                products = await Product.find({
                    "price": {
                        "$gte": priceA,
                        "$lte": priceB
                    }
                }).or([
                    {"name": { $regex: reg}},
                    {"color": { "$elemMatch": {"name": {$regex: reg}}}},
                    {"productCode": { $regex: reg}},
                    {"tags": query},
                    {"alternatives": query}
                ]).sort(sort)
            }
        } else {
            if(priceA==0 && priceB==0) {
                products = await Product.find({
                    "category._id": req.params.categoryId
                }).or([
                    {"name": { $regex: reg}},
                    {"color": { "$elemMatch": {"name": {$regex: reg}}}},
                    {"productCode": { $regex: reg}},
                    {"tags": query},
                    {"alternatives": query}
                ]).sort(sort)
            } else if(priceB==0) {
                products = await Product.find({
                    "category._id": req.params.categoryId,
                    "price": {
                        "$gte": priceA
                    }
                }).or([
                    {"name": { $regex: reg}},
                    {"color": { "$elemMatch": {"name": {$regex: reg}}}},
                    {"productCode": { $regex: reg}},
                    {"tags": query},
                    {"alternatives": query}
                ]).sort(sort)
            } else {
                products = await Product.find({
                    "category._id": req.params.categoryId,
                    "price": {
                        "$gte": priceA,
                        "$lte": priceB
                    }
                }).or([
                    {"name": { $regex: reg}},
                    {"color": { "$elemMatch": {"name": {$regex: reg}}}},
                    {"productCode": { $regex: reg}},
                    {"tags": query},
                    {"alternatives": query}
                ]).sort(sort)
            }
        }
    } else {
        if(req.params.categoryId=="all") {
            if(priceA==0 && priceB==0) {
                products = await Product.find().sort(sort)
            } else if(priceB==0) {
                products = await Product.find({
                    "price": {
                        "$gte": priceA
                    }
                }).sort(sort)
            } else {
                products = await Product.find({
                    "price": {
                        "$gte": priceA,
                        "$lte": priceB
                    }
                }).sort(sort)
            }
        } else {
            if(priceA==0 && priceB==0) {
                products = await Product.find({
                    "category._id": req.params.categoryId
                }).sort(sort)
            } else if(priceB==0) {
                products = await Product.find({
                    "category._id": req.params.categoryId,
                    "price": {
                        "$gte": priceA
                    }
                }).sort(sort)
            } else {
                products = await Product.find({
                    "category._id": req.params.categoryId,
                    "price": {
                        "$gte": priceA,
                        "$lte": priceB
                    }
                }).sort(sort)
            }
        }
    }
    
    let length = products.length;
        products.splice(0, skip);
        products.splice(limit, (products.length-limit));

        res.send({
            products: products,
            length: length
        });}

sortProducts = async (req, res) => {
    let page = Number(req.params.page);
    let limit = 20;
    let skip = limit * (page-1);

    const allProducts = await Product.find().sort(req.params.sortValue);
    
    const products = await Product.find().sort(req.params.sortValue).skip(skip).limit(limit);

    res.send({
        products: products,
        length: allProducts.length
    });
}

getPopularProducts = async (req, res) => {
    const products = await Product.find().sort("-views").limit(4);

    res.send(products)
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

    let variant;
    if(req.body.variantId===''){
        variant = {
            _id: '',
            name: '',
            values: []
        }} else {
        variant = await Variant.findById(req.body.variantId);
        if(!variant) { return res.status(400).send("Taki wariant nie istnieje");
     }
    }

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
        shortDescription: req.body.shortDescription,
        productCode: req.body.productCode,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        productImage: req.body.productImage,
        shipmentTime: req.body.shipmentTime,
        ID: currentNumber,
        tags: req.body.tags,
        alternatives: req.body.alternatives,
        variant: variant,
        dateAdded: Date.now()
    });
    try {
        await newProduct.save();
        res.send({
            message: "Nowy produkt dodany prawidłowo.",
            newProduct
        })

    } catch (error) { return res.status(500).send("Cos poszło nie tak") };
};

updatePrice = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) { return res.status(400).send("Taki produkt nie istnieje."); };

    product.price = req.body.price;

    try {
        await product.save();
        res.send({
            message: "Cena zmieniona"
        })
    } catch(err) {
        return res.status(500).send("Coś poszło nie tak")
    }
}
updateStock = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) { return res.status(400).send("Taki produkt nie istnieje."); };

    product.numberInStock = req.body.stock;

    try {
        await product.save();
        res.send({
            message: "Stan magazynowy zmieniony"
        })
    } catch(err) {
        res.status(500).send("Coś poszło nie tak")
    }
}

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
    let variant;
    if(req.body.variantId===''){
        variant = {
            _id: '',
            name: '',
            values: []
        }} else {
        variant = await Variant.findById(req.body.variantId);
        if(!variant) { return res.status(400).send("Taki wariant nie istnieje");
        }
    }

    const baskets = await Basket.find();

    for(let i=0; i<baskets.length;i++) {
        let products = baskets[i].products;
        let cost=0;
        let sum=0;
        for(let y=0;y<products.length;y++) {
            if(products[y]._id==req.params.id) {
                let basket = await Basket.findById(baskets[i]._id)
                products[y].price=req.body.price;
                for (z=0; z < products.length; z++) {
                    sum = products[z].price * products[z].amount;
                    cost = cost + sum;
                }
                basket.set({
                    products: products,
                    cost: cost
                })
                try {
                await basket.save()
                } catch(err) {
                    return res.status(500).send("Coś poszło nie tak")
                }
            }
        }
    }

    product.set({
        name: req.body.name,
        category: {
            name: category.name,
            _id: category._id,
            ID: category.ID
        },
        color: req.body.color,
        description: req.body.description,
        shortDescription: req.body.shortDescription,
        productCode: req.body.productCode,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        productImage: req.body.productImage,
        shipmentTime: req.body.shipmentTime,
        variant: variant,
        tags: req.body.tags,
        alternative: req.body.alternatives

    });
    try {
        await product.save();
        res.send({
            product,
            message: "Produkt poprawnie zaktualizowany."});
    } catch (error) { res.status(500).send("Coś poszło nie tak"); }
};

deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) { return res.status(400).send("Taki produkt nie istnieje."); };

    res.send({ message: `Produkt ${product.name} o ID ${req.params.id} usunięty poprawnie.` });

}

addView = async (req, res) => {
    let product = await Product.findOne({"ID": req.params.id});
    if(!product) { return res.status(400).send("Produkt nie istnieje."); }

    product.views += 1;


    try {
        product.save()
    } catch(err) {
        console.log("Błąd z dodaniem wyświetlenia")
    }

    res.send(product)
}

fileUpload = async (req, res) => {
    const file = req.file;

    res.json({filePath: `https://mysterious-river-61775.herokuapp.com/product/` + file.path})}

    // res.json({filePath: `${baseURL}/product/` + file.path})}


module.exports = {addView, getProduct, getAllProducts, getProducts, getProductsByCategory, getProductsByQuery, getProductsByFilters, getPopularProducts, sortProducts, addProduct, updateProduct, updatePrice, updateStock, deleteProduct, fileUpload};