# Szycie To Życie - online shop

### Table of Contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Resources](#resources)


### General info

This is a fully functional online shop and business site in one place. 'Szycie to Życie' is example site for tailoring studio with online shop in addition.<br>

IMPORTANT - App is in polish language


### Technologies

#### Database
* Mongo DB

#### Backend
* Node.js
* Express.js
* JavaScript

#### Frontend
* React
* JavaScript
* Redux
* JSX
* HTML
* CSS


### Setup

If you want to check how it looks just go to <a href='https://szycietozycie.firebaseapp.com'>DEMO</a> site! ^<br>
To launch app on your local computer, you have to execute undermentioned steps^^^: 
1. Open terminal and make sure you have installed npm and node.js on your local machine -> ``$ npm -v`` and ``$ node -v`` (this commands check versions of npm and node.js
2. Clone this repository -> ``$ git clone https://github.com/kam237zasada/Szycietozycie.git``
3. Go into client directory in project -> ``$ cd Szycietozycie/client``
4. Install all dependencies -> ``$ npm i`` or ``$ npm install``
5. Run app on localhost:8000 -> ``$ npm start`` (it should open Web Browser automatically)
6. Open another terminal directly inside server directory in project (Szycietozycie/server)
7. Install all dependencies -> ``$ npm i`` or ``$ npm install``
8. Run server on localhost:3000 -> ``$ node index.js``

^ Here you have credentials for example existing user:
``login: krulikos``
``password: password123``<br>
^^ If you want to sign as Admin, to see how looks from Admin's point of view, don't wait and just write to me.<br>
^^^ Some features would not be working because of environment variables which have to be hide. If you want to see full performance of application see <a href='https://szycietozycie.firebaseapp.com'>DEMO</a>. 


### Features

#### Customer

* Creating an accout
* Updating password and data
* Password reminder
* Add customer's data (address, city etc.)

#### Admin

* Adding and deleting products (description, photos, product code etc.)
* Creating shipments methods
* Creating payments methods
* Creating information sites (statute, privacy policy and whatever admin wants)
* Orders management
* Creating categories

#### Order

* Private (only for admins) and public comments
* Mailing with every status change

#### Basket

* Easy adding and deleting products

#### Others

* Discount codes
* Search engine
* Application is protected with jsonwebtoken
* bcrypt to hash passwords


### Resources

* Font-Awesome
* Semantic-UI
* *https://www.pexels.com/pl-pl/*
* *https://pixabay.com/pl/*

NOTICE: I do not own any photos of example products. These photos are not for commercial use or for sale. Photos included in application are only for show it performance.

