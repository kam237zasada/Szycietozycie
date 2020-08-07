const {Basket, validateBasket} = require('../models/basket');
const {Product} = require('../models/product');
const mongoose = require('mongoose'); 



getBaskets = async (req, res) => {
    const baskets = await Basket.find();
    res.send(baskets);
};

getBasket = async (req, res) => {
    let basket;
    try {
        basket = await Basket.findOne({"_id": req.params.id});
        if(!basket) return res.status(404).send("Koszyk nie istnieje");

} catch (error) {
    return res.status(500).send("Wystapił nieoczekiwany błąd.");
}

    res.send(basket);
};

addBasket = async (req, res) => {
    
    let product = await Product.findById(req.body._id);
    if(!product) return res.status(404).send("Produkt nie istnieje");
    let products = [];
    if(product.numberInStock < req.body.amount) {
        return res.status(400).send("Nie ma tylu produktów na stanie!");
    }
    products.push({
        _id: product._id,
        productImage: product.productImage,
        name: product.name,
        color: req.body.color,
        variantName: req.body.variantName,
        variantValue: req.body.variantValue,
        productCode: product.productCode,
        amount: req.body.amount,
        price: product.price,
        ID: product.ID
    })
    // const { error } = validateBasket({);
    // if (error) {
    //     return res.status(400).send(error.details[0].message);
    // };
    let cost = products[0].price* products[0].amount;
    
    const newBasket = new Basket({
        products: products,
        cost: cost
    });

    try {
        await newBasket.save();
        res.send({
            message: "Nowy koszyk dodany.",
            _id: newBasket._id,
            products: newBasket.products,
            cost: newBasket.cost
        });

    
    } catch (error) { res.status(500).send("Cos poszło nie tak")
        ;}
    
        


}

updateBasket = async (req, res) => {
    let basket = await Basket.findOne({"_id": req.params.id});
    if(!basket) return res.status(404).send("Koszyk nie istnieje");
    let product = await Product.findById(req.body._id);
    if(!product) return res.status(404).send("Produkt nie istnieje");
    let products = [];
    let cost = 0;
    let sum = 0;
    products = basket.products;
    if(req.body.operation==="insertion") {
        let addNewProduct = true;
        for (let i =0; i<products.length;i++) {
            if(products[i]._id==req.body._id && products[i].color=== req.body.color && products[i].variantName===req.body.variantName && products[i].variantValue===req.body.variantValue) {
                if(products[i].amount + req.body.amount > product.numberInStock) {return res.status(400).send("Nie ma tylu produktów na stanie!")}
                products[i].amount += req.body.amount;
                products.set(i, products[i]);
                addNewProduct = false;
            }
        }
        if(addNewProduct) {
    products.push({
        _id: product._id,
        productImage: product.productImage,
        name: product.name,
        color: req.body.color,
        variantName: req.body.variantName,
        variantValue: req.body.variantValue,
        productCode: product.productCode,
        amount: req.body.amount,
        price: product.price,
        ID: product.ID
    });
}
    
    // for (let i=0; i < products.length; i++) {
    //     sum = products[i].price * products[i].amount;
    //     cost = cost + sum;
    // }
}

    if (req.body.operation==="deletion") {

        if (req.body.amount==="all") {
        for (let i =0; i<products.length;i++) {
            if(products[i]._id==req.body._id && products[i].color===req.body.color && products[i].variantName===req.body.variantName && products[i].variantValue===req.body.variantValue) {
                products.splice(i, 1)
            }
        }
    
    } else { 
        for (let i=0; i<products.length;i++) {
        if(products[i]._id==req.body._id && products[i].color===req.body.color && products[i].variantName===req.body.variantName && products[i].variantValue===req.body.variantValue) {
            products[i].amount -= req.body.amount;
            if(products[i].amount===0) {
                products.splice(i, 1);
            } else {
            products.set(i, products[i]);
            }
        }
    }
    }
}


    for (i=0; i < products.length; i++) {
        sum = products[i].price * products[i].amount;
        cost = cost + sum;
    }


    basket.set({
        products: products,
        cost: cost
    });


    try {
        await basket.save();
        res.send({
            products: basket.products,
            cost: basket.cost,
            message: "Koszyk zaktualizowany"
        });
    } catch (error) { return res.status(500).send("Cos poszło nie tak"); }
}

deleteBasket = async (req, res) => {
    const basket = await Basket.findByIdAndDelete(req.params.id);
    if(!basket) { return res.status(400).send("Taki koszyk nie istnieje."); };

    res.send({ message: `Koszyk ${basket._id} usunięty poprawnie.` });

}

module.exports = {getBaskets, getBasket, addBasket, updateBasket, deleteBasket}

