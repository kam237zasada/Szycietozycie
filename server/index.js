require('dotenv').config({path: '.env'});
const express = require('express');
const multer = require('multer');
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

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))
app.use('/product/uploads', express.static('./uploads'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://kam237zasada:kam237zasada@cluster0-ylby9.mongodb.net/test?retryWrites=true&w=majority', { useFindAndModify: false, useNewUrlParser: true,useUnifiedTopology: true })
    .then (() => console.log("Connected.."))
    .catch (err => console.error(err));

app.use(express.json());
app.use('/admin', admins);
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




