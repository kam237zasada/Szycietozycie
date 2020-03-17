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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://kam237zasada:kam237zasada@cluster0-ylby9.mongodb.net/test?retryWrites=true&w=majority')
    .then (() => console.log("Connected.."))
    .catch (err => console.error(err));

app.use(express.json());
app.use('/admin', admins);
app.use('/product', products);
app.use('/category', categories);

