const express = require('express');
const {Order, validateOrder} = require('../models/order');
const {Product} = require('../models/product');
const {Shipment} = require('../models/shipment');
const {Payment} = require('../models/payment');
const {Basket} = require('../models/basket');
const {Status} = require('../models/status');
const {Discount} = require('../models/discount');
const templates = require('../emailTemplates/templates');
const { getDate } = require('../js/index');
const { generateOrderToken } = require('../controllers/auth')
const { baseURL } = require('../config/index');
const request = require('request');
const { appKey, secretKey } = require('../config/index');


getOrder = async (req, res) => {
    let order = await Order.findOne({"ID": req.params.id});
    if(!order) { return res.status(400).send("Nie ma takiego zamówienia."); }

    res.send(order);
};

getOrders = async (req, res) => {
    let page = Number(req.params.page);
    let limit = 20;
    let skip = limit * (page-1);
    const allOrders = await Order.find();
    const orders = await Order.find().sort('-ID').skip(skip).limit(limit);    
    if(!orders) { return res.status(400).send("Brak zamówień")}

    res.send({
        orders: orders,
        length: allOrders.length
    });
}

getOrdersByQuery = async (req, res) => {
    let page = Number(req.params.page);
    let query = req.params.query;
    const reg = new RegExp(query, "i");
    let orders=[];
    ordersNext=[];
    switch(req.params.status) {
        case 'all':
    if(!isNaN(query)) {
        orders = await Order.find({"ID":query})
    }
    ordersNext = await Order.find().or([
        {"customerIdentities.name": { $regex: reg}},
            {"customerIdentities.email": { $regex: reg}},
            {"customerIdentities.telephone": query},
            {"customerIdentities.city": { $regex: reg}},
            {"customerIdentities.zipCode": query},
            {"shipmentIdentities.name":{ $regex: reg}},
            {"shipmentIdentities.city": { $regex: reg}},
            {"shipmentIdentities.telephone": query},
            {"shipmentIdentities.zipCode": query},
            {"customer.login": query},
            {"invoiceIdetities.companyName":{ $regex: reg}},
            {"invoiceIdetities.NIP": query},
            {"invoiceIdetities.city": { $regex: reg}},
            {"invoiceIdetities.zipCode": query},
            {"products": {"$elemMatch": {"name": { $regex: reg}}}}


    ]).sort('-ID')
    break;
    case 'new':
        if(!isNaN(query)) {
            orders = await Order.find({"ID":query}, {"status.type":"Nowe"})
        }
        ordersNext = await Order.find({"status.type":"Nowe"}).or([
            {"customerIdentities.name": { $regex: reg}},
            {"customerIdentities.email": { $regex: reg}},
            {"customerIdentities.telephone": query},
            {"customerIdentities.city": { $regex: reg}},
            {"customerIdentities.zipCode": query},
            {"shipmentIdentities.name":{ $regex: reg}},
            {"shipmentIdentities.city": { $regex: reg}},
            {"shipmentIdentities.telephone": query},
            {"shipmentIdentities.zipCode": query},
            {"customer.login": query},
            {"invoiceIdetities.companyName":{ $regex: reg}},
            {"invoiceIdetities.NIP": query},
            {"invoiceIdetities.city": { $regex: reg}},
            {"invoiceIdetities.zipCode": query},
            {"products": {"$elemMatch": {"name": { $regex: reg}}}}
    
    
        ]).sort('-ID')
        break;
        case 'open':
        if(!isNaN(query)) {
            orders = await Order.find({"ID":query}, {"status.type":"Otwarte"})
        }
        ordersNext = await Order.find({"status.type":"Otwarte"}).or([
            {"customerIdentities.name": { $regex: reg}},
            {"customerIdentities.email": { $regex: reg}},
            {"customerIdentities.telephone": query},
            {"customerIdentities.city": { $regex: reg}},
            {"customerIdentities.zipCode": query},
            {"shipmentIdentities.name":{ $regex: reg}},
            {"shipmentIdentities.city": { $regex: reg}},
            {"shipmentIdentities.telephone": query},
            {"shipmentIdentities.zipCode": query},
            {"customer.login": query},
            {"invoiceIdetities.companyName":{ $regex: reg}},
            {"invoiceIdetities.NIP": query},
            {"invoiceIdetities.city": { $regex: reg}},
            {"invoiceIdetities.zipCode": query},
            {"products": {"$elemMatch": {"name": { $regex: reg}}}}

    
    
        ]).sort('-ID')
        break;
        case 'finalized':
        if(!isNaN(query)) {
            orders = await Order.find({"ID":query}, {"status.type":"Zakończone"})
        }
        ordersNext = await Order.find({"status.type":"Zakończone"}).or([
            {"customerIdentities.name": { $regex: reg}},
            {"customerIdentities.email": { $regex: reg}},
            {"customerIdentities.telephone": query},
            {"customerIdentities.city": { $regex: reg}},
            {"customerIdentities.zipCode": query},
            {"shipmentIdentities.name":{ $regex: reg}},
            {"shipmentIdentities.city": { $regex: reg}},
            {"shipmentIdentities.telephone": query},
            {"shipmentIdentities.zipCode": query},
            {"customer.login": query},
            {"invoiceIdetities.companyName":{ $regex: reg}},
            {"invoiceIdetities.NIP": query},
            {"invoiceIdetities.city": { $regex: reg}},
            {"invoiceIdetities.zipCode": query},
            {"products": {"$elemMatch": {"name": { $regex: reg}}}}
    
    
        ]).sort('-ID')
        break;
    }
    let allMatchOrders = orders.concat(ordersNext);
    let length = allMatchOrders.length;
    let limit = 20;
    let skip = limit * (page-1);
    allMatchOrders.splice(0, skip);
    allMatchOrders.splice(limit, (allMatchOrders.length-limit));
    
    res.send({
        orders: allMatchOrders,
        length: length}
        )

}

getNewOrders  = async (req, res) => {
    let page = Number(req.params.page)
    let limit = 20;
    let skip = limit * (page-1);
    const allOrders = await Order.find({"status.type": "Nowe"}) 
    const orders = await Order.find({"status.type": "Nowe"}).sort("-ID").skip(skip).limit(limit);  
    if(!orders) { return res.status(400).send("Brak zamówień")}

    res.send({
        orders: orders,
        length: allOrders.length
    });}

getOpenOrders = async (req, res) => {
    let page = Number(req.params.page);
    let limit = 20;
    let skip = limit * (page-1);
    const allOrders = await Order.find({"status.type": "Otwarte"}) 
    const orders = await Order.find({"status.type": "Otwarte"}).sort("-ID").skip(skip).limit(limit);  
    if(!orders) { return res.status(400).send("Brak zamówień")}

    res.send({
        orders: orders,
        length: allOrders.length
    });

}

getFinalizedOrders = async (req, res) => {
    let page = Number(req.params.page)
    let limit = 20;
    let skip = limit * (page-1);
    const allOrders = await Order.find({"status.type": "Zakończone"}) 
    const orders = await Order.find({"status.type": "Zakończone"}).sort("-ID").skip(skip).limit(limit);  
    if(!orders) { return res.status(400).send("Brak zamówień")}

    res.send({
        orders: orders,
        length: allOrders.length
    });
}

getOrdersByClient = async (req, res) => {
    const orders = await Order.find({"customer._id": req.params.id}).sort("-ID");
    if(!orders) { return res.status(400).send("Brak zamówień")}

    res.send(
        orders);
}

getSingleOrder = async (req, res) => {
    const order = await Order.find({"token": req.params.accessToken});
    if(!order) { return res.status(401).send("Nieautoryzowany dostęp")}

    res.send(order)
}

addOrder = async (req, res) => {
    const { error } = validateOrder(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};
    const mail = req.body.customerIdentities.email;


    let currentNumber;
    let orders = await Order.find();
    if(orders.length===0) { currentNumber = 1} else {
    let lastElementIndex = orders.length -1;
    currentNumber = orders[lastElementIndex].ID +1;
    }

    let shipment = await Shipment.findById(req.body.shipmentId)
    let payment = await Payment.findById(req.body.paymentId);
    let status = await Status.findOne({isDefault: true});

    let productsInBasket = req.body.products;
    let products=[{_id: productsInBasket[0]._id, amount: productsInBasket[0].amount}];

    for (let i =1; i<productsInBasket.length; i++) {
        let x= false;
        for(let j=0; j<products.length; j++) {
            if(products[j]._id == productsInBasket[i]._id) {
                x = true
                products[j].amount += productsInBasket[i].amount
            }
        }
        if(!x) { products.push({_id: productsInBasket[i]._id, amount: productsInBasket[i].amount}) }
        
    }


    for (let i=0; i<products.length; i++) {
        let product = await Product.findOne({"_id": products[i]._id})
        if(product.numberInStock < products[i].amount) {
            return res.status(400).send(`Upps, wystąpił problem z produktem ${product.name}, jest go za mało na stanie. Jest go ${product.numberInStock} w magazynie.`)
        }
        
        
    }

    for (let i=0; i<products.length; i++) {
        let product = await Product.findOne({"_id": products[i]._id})
        product.numberInStock -= products[i].amount;
        product.sold += products[i].amount;

        try {
            await product.save();
        } catch (err) {
            return res.status(500).send("Coś poszło nie tak")
        }  
    }
    let usedBy;
    let customer = req.body.customer;
    if(customer.login==="") {
        customer = "Niezarejestrowany"
        usedBy = "Niezarejestrowany"
    } else {
        usedBy = req.body.customer._id
    }    
    if(req.body.discountActive) {
        let code = await Discount.findOne({"code": req.body.discountUsed});
        if(!code) { return res.status(400).send("Nie ma takiego kodu rabatowego")};
        code.usedBy.push(usedBy);
        try{ 
        await code.save();
    }
    catch(err) {
        return res.status(500).send("Coś poszło nie tak")
    }
    }
    let order = {
        ID: currentNumber,
        customer: req.body.customerIdentities.email
    };

    let token=generateOrderToken(req, order)

    let link = `${baseURL}/sklep/order/single-order/${token.accessToken}`


    const newOrder = new Order({
        customerIdentities: req.body.customerIdentities,
        shipmentIdentities: req.body.shipmentIdentities,
        invoiceIdentities: req.body.invoiceIdentities,
        customer: customer,
        products: req.body.products,
        shipment: {
            _id: shipment._id,
            ID: shipment.ID,
            name: shipment.name,
            price: req.body.shipmentCost,
        },
        payment: payment,
        ID: currentNumber,
        value: req.body.cost + req.body.shipmentCost,
        comment: req.body.comment,
        status: status,
        discountActive: req.body.discountActive,
        discountUsed: req.body.discountUsed,
        token: token.accessToken,
        dateAdded: Date.now()
        });


    try {
        await newOrder.save();
        res.send({
            message: "Zostało złożone zamówienie.",
            newOrder
        })
        let basket = await Basket.findByIdAndDelete(req.body.basketId);
            if(!basket) { return res.status(400).send("Koszyk nie istnieje.")};

            try {
                await request.post({
            url: 'https://api.emaillabs.net.pl/api/new_sendmail',
            headers: {
                'content-type' : 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + new Buffer.from(`${appKey}:${secretKey}`).toString("base64")
            },
            form: {
                to: {
                    [mail]: ''
                },
                'subject': `Zamówienie o ID ${newOrder.ID} zostało złożone`,
                'html':templates.placedOrder({orderId: newOrder.ID, shipment: newOrder.shipment.name, payment: newOrder.payment.name, products: newOrder.products, value: newOrder.value, link: link}),
                'smtp_account': '1.kam237zasada.smtp',
                'from': 'sklep@przykladowymail.pl'
            }
        },
        function (error, response, body) {
        }
        )
        res.status(200).send("Wiadomość wysłana")
        } catch(err) {
        res.status(500).send("coś poszło nie tak");
        }

    } catch (error) { return res.status(500).send("Cos poszło nie tak") };
    
};

updateOrderStatus = async (req,res) => {
    let order = await Order.findOne({"_id": req.params.id})
    if(!order) { return res.status(400).send("Takie zamówienie nie istnieje.")}

    let status = await Status.findOne({"ID": req.body.statusID});
    if(!status) { return res.status(400).send("Taki status nie istnieje.")}

    order.status = status;
    const mail = order.customerIdentities.email;
    

    try {
        await order.save();
        res.send({
            message: "Status zmieniony"
        })

        try {
            await request.post({
        url: 'https://api.emaillabs.net.pl/api/new_sendmail',
        headers: {
            'content-type' : 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + new Buffer.from(`${appKey}:${secretKey}`).toString("base64")
        },
        form: {
            to: {
                [mail]: ''
            },
            'subject': `Zmiana statusu Twojego zamówienia nr ${order.ID}`,
            'html':templates.statusChanged({status: status, orderId: order.ID }),
            'smtp_account': '1.kam237zasada.smtp',
            'from': 'sklep@przykladowymail.pl'
        }
    },
    function (error, response, body) {
    }
    )
    res.status(200).send("Wiadomość wysłana")
    } catch(err) {
    res.status(500).send("coś poszło nie tak");
    }

    } catch (err) {
        return res.status(500).send("Cos poszło nie tak")
    }

}

updatePrivateComment = async (req, res) => {
    let order = await Order.findOne({"ID":req.params.id});
    if(!order) { return res.status(400).send("Takie zamówienie nie istnieje");}

    order.set({
        privateComment: req.body.privateComment
    })

    try {
        await order.save();
        res.send("Uwagi prywatne dodane");
    } catch (err) {
        return res.status(400).send(err.response.data);
    }
}

updateMessages = async (req, res) => {
    let order = await Order.findOne({"ID": req.params.id});
    if(!order) { return res.status(400).send("Takie zamówienie nie istnieje");}

    let messages = order.messages;
    let message = {
        comment: req.body.comment,
        waybill: req.body.waybill,
        shipmentCompany: req.body.shipmentCompany
    }
    messages.push(message)

    try {
        await order.save();
        res.send("Wiadomość zapisana");
    } catch (err) {
        return res.status(400).send(err.response.data)
    }


}


module.exports = {
    getOrder, 
    getNewOrders,
    getOpenOrders, 
    getFinalizedOrders, 
    getOrdersByQuery,
    getOrdersByClient, 
    getOrders, 
    addOrder, 
    updateOrderStatus, 
    updatePrivateComment, 
    updateMessages,
    getSingleOrder
};