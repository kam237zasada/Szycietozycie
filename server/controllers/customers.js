const bcrypt = require('bcrypt');
const {Customer, validateCustomer, validateData, validateCustomerUpdate, validatePassword, validateCompanyIdentities} = require('../models/customer');
const templates = require('../emailTemplates/templates');
const { generateTokens } = require('../controllers/auth')
const request = require('request');
const { appKey, secretKey } = require('../config/index');

getCustomers = async (req, res) => {
    let page = Number(req.params.page);
    let limit = 20;
    let skip = limit * (page-1);
    const allCustomers = await Customer.find().select('-password');
    const customers = await Customer.find().select('-password').sort('dateCreated').limit(limit).skip(skip);
    res.send({
        customers:customers,
        length: allCustomers.length
    });
}

getCustomersByQuery = async (req, res) => {
    let page = Number(req.params.page);
    let query = req.params.query;
    const reg = new RegExp(query, "i");

    let customers = await Customer.find().or([
        {"customerIdentities.name": { $regex: reg}},
        {"customerIdentities.telephone": query},
        {"customerIdentities.zipCode": query},
        {"customerIdentities.city": query},
        {"companyIdentities.name": { $regex: reg}},
        {"companyIdentities.NIP": query},
        {"companyIdentities.zipCode": query},
        {"companyIdentities.city": query},
        {"login": { $regex: reg}},
        {"email": { $regex: reg}},
    ])
    if(!customers) { return res.status(400).send("Brak klientów")}

    let length = customers.length;
    let limit = 20;
    let skip = limit * (page-1);
    customers.splice(0, skip);
    customers.splice(limit, (customers.length-limit));

    res.send({
        customers: customers,
        length: length
    });
}

getCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id).select('-password');

    if (!customer) return res.status(404).send('Taki użytkownik nie istnieje.');
    res.send(customer);

}

addCustomer = async (req, res) => {

        const validation = validateCustomer(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details[0].message);
        };

        let findEmail = await Customer.findOne({email: req.body.email});
        let findLogin = await Customer.findOne({login: req.body.login});

        if(findEmail) {
            return res.status(400).send('Istnieje już użytkownik o takim adresie e-mail, podaj inny adres.');
        }
        if(findLogin) {
            return res.status(400).send('Istnieje juz użytkownik o takim loginie, podaj inny.');
        }

        if (req.body.password != req.body.confirmPassword) {
            return res.status(400).send('Hasła muszą być identyczne.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newCustomer = new Customer({
            login: req.body.login,
            email: req.body.email,
            password: hashedPassword
        });

        try {
            await newCustomer.save();
            res.send({
                message: "Nowy użytkownik zarejestrowany.",
                login: newCustomer.login,
                email: newCustomer.email,
                _id: newCustomer._id
            });
        
        } catch (error) { res.status(500).send("Coś poszło nie tak");}
}

loginCustomer = async (req, res) => {
    const login = await Customer.findOne({login: req.body.login});
    const email = await Customer.findOne({email: req.body.email});

    if(!login && !email) { return res.status(400).send("Login lub/i hasło są nieprawidłowe.")};
    let validateWithLogin, validateWithEmail;
    if (login) { validateWithLogin = await bcrypt.compare(req.body.password, login.password);}
    if (email) { validateWithEmail = await bcrypt.compare(req.body.password, email.password);}

    if(!validateWithLogin && !validateWithEmail) { return res.status(400).send("Login lub/i hasło są nieprawidłowe.")};
    let customer;
    if(validateWithLogin) { customer = login}
    else { customer = email};
    let tokens = generateTokens(req, customer)
    try {
    res.send({
        message: `Użytkownik ${customer.login} zalogowany poprawnie.`,
        login: customer.login,
        email: customer.email,
        _id: customer._id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    })
} catch(err) {
    res.status(500).send("Coś poszło nie tak")
}
}

passwordReminder = async (req, res) => {
    const customer = await Customer.findOne({email: req.body.email});

    if(!customer) { return res.status(400).send("Nie ma użytkownika o takim adresie email")};

    let tokens = generateTokens(req, customer);
    const mail = customer.email;


    const msg = {
        to: req.body.email,
        from: 'sklep@torebkowamania.pl',
        subject: `Przypomnienie hasła Torebkowa Mania`,
        html: templates.passwordReminder({login: customer.login, _id: customer._id, token: tokens.accessToken })
    }

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
        'subject': `Przypomnienie hasła Torebkowa Mania`,
        'html':templates.passwordReminder({login: customer.login, _id: customer._id, token: tokens.accessToken }),
        'smtp_account': '1.torebkowamania.smtp',
        'from': 'sklep@torebkowamania.pl'
    }
},
function (error, response, body) {
    console.log(body)
}
)
res.status(200).send("Wiadomość wysłana")
} catch(err) {
res.status(500).send("coś poszło nie tak");
}

    res.send("Wysłano wiadomość na podany adres email. Może potrwać kilka minut nim otrzymasz wiadomość. Sprawdź także w folderze SPAM. ")

}

newPassword = async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if(!customer) { return res.status(400).send("Nie ma takiego użytkownika")};

    let error = validatePassword({password: req.body.password, confirmPassword: req.body.password});
        if (error.error) { 
            return res.status(400).send(error.error.details[0].message); };

            const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    customer.set({
        password: hashedPassword
    });

    try {
        await customer.save();
        res.send("Hasło poprawnie zaktualizowane");
    } catch (error) { res.status(500).send("coś poszło nie tak"); }

}

updateData = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("Użytkownik nie istnieje!");

    const error = validateData(req.body);
        if (error.error) { return res.status(400).send(error.error.details[0].message); };

    customer.set({
        customerIdentities: req.body
    });
    try {
        await customer.save();
        res.send({
            login: customer.login,
            email: customer.email,
            customerIdentities: customer.customerIdentities,
            companyIdentities: customer.companyIdentities,
            message: "Adres dodany poprawnie."});
    } catch (error) { res.status(500).send("Coś poszło nie tak"); }
};

updateInvoice = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("Użytkownik nie istnieje!");

    const error = validateCompanyIdentities(req.body);
        if (error.error) { return res.status(400).send(error.error.details[0].message); };

    customer.set({
        companyIdentities: req.body
    });
    try {
        await customer.save();
        res.send({
            login: customer.login,
            email: customer.email,
            customerIdentities: customer.customerIdentities,
            companyIdentities: customer.companyIdentities,
            message: "Dane o firmie dodane poprawnie."});
    } catch (error) { res.status(500).send("Coś poszło nie tak"); }
};

updatePassword = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) { return res.status(404).send("Użytkownik nie istnieje."); }
    if(!req.body.password || !req.body.currentPassword || !req.body.confirmPassword) {
        return res.status(400).send("Wszystkie pola muszą być wypełnione");
    }
    const password = await bcrypt.compare(req.body.currentPassword, customer.password);
    if(!password) { return res.status(400).send("Podane hasło nie jest prawidłowe."); }

    if(req.body.password != req.body.confirmPassword) { return res.status(400).send("Hasła muszą być identyczne"); }

    let error = validatePassword({password: req.body.password, confirmPassword: req.body.confirmPassword});
        if (error.error) { 
            return res.status(400).send(error.error.details[0].message); };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    customer.set({
        password: hashedPassword
    });

    try {
        await customer.save();
        res.send({ message: "Hasło poprawnie zaktualizowane" });
    } catch (error) { res.status(500).send("Cos poszło nie tak"); }

}

updateCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("Użytkownik nie istnieje.");


    const auth = {
        email: req.body.email,
        login: req.body.login
    }

    
    let err = validateCustomerUpdate(req.body);
        if (err.error) { return res.status(400).send(err.error.details[0].message); }


    const login = await Customer.findOne({login: req.body.login});
    if(login && login._id != req.params.id) { return res.status(400).send("Taki login jest już zajęty przez innego użytkownika, podaj inny.")};
    const email = await Customer.findOne({email: req.body.email});
    if(email && email._id != req.params.id) { return res.status(400).send("Taki email jest już zarejestrowany, podaj inny.")};


    customer.set({
        login: req.body.login,
        email: req.body.email,
    });

    try {
        await customer.save();
        res.send({
            login: req.body.login,
            email: req.body.email,
            message: "Użytkownik poprawnie zaktualizowany."});
    } catch (error) { res.status(500).send("Coś poszło nie tak"); }
};

deleteCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) { return res.status(400).send("Użytkownik nie istnieje."); };

    res.send({ message: `Użytkownik ${customer.login} o ID ${customer._id} poprawnie usunięty.` });
}

module.exports = {getCustomers, getCustomersByQuery, getCustomer, addCustomer, loginCustomer, passwordReminder, newPassword, updateData, updateInvoice, updatePassword, updateCustomer, deleteCustomer};