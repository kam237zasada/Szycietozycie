require('dotenv').config({path: '.env'});
const DBConnection = process.env.mongo;
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const admins = require('./routes/admins');
const products = require('./routes/products');
const categories = require('./routes/categories');
const customers = require('./routes/customers');
const baskets = require('./routes/baskets');
const shipments = require('./routes/shipments');
const payments = require('./routes/payments');
const orders = require('./routes/orders');
const statuses = require('./routes/statuses');
const mails = require('./routes/mails');
const colors = require('./routes/colors');
const variants = require('./routes/variants');
const discounts = require('./routes/discounts');
const sites = require('./routes/sites');


app.use('/product/uploads', express.static('./uploads'));
app.use(require('prerender-node').set('prerenderToken', 'SfvBbtKiFwykFd02xnau'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))
app.use('/product/uploads', express.static('./uploads'));


    mongoose.connect(DBConnection, { useFindAndModify: false, useNewUrlParser: true,useUnifiedTopology: true })
    .then (() => console.log("Connected.."))
    .catch (err => console.error(err));


app.use(express.json());
app.use('/user', admins);
app.use('/product', products);
app.use('/category', categories);
app.use('/customer', customers);
app.use('/basket', baskets);
app.use('/shipment', shipments);
app.use('/payment', payments);
app.use('/order', orders);
app.use('/status', statuses);
app.use('/mail', mails);
app.use('/color', colors);
app.use('/variant', variants);
app.use('/discount', discounts);
app.use('/site', sites);






