const bcrypt = require('bcrypt');
const {Customer, validateCustomer, validateData, validateCustomerUpdate, validatePassword} = require('../models/customer');

getCustomers = async (req, res) => {
    const customers = await Customer.find().select('-password').sort('dateCreated');
    res.send(customers);
}

getCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id).select('-password');

    if (!customer) return res.status(404).send('Taki użytkownik nie istnieje.');
    res.send(customer);
}

addCustomer = async (req, res) => {

        const { error } = validateCustomer(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
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
        
        } catch (error) { res.status(400).send(error);}
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
    res.send({
        message: `Użytkownik ${customer.login} zalogowany poprawnie.`,
        login: customer.login,
        email: customer.email,
        _id: customer._id
    })
}

addData = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("Użytkownik nie istnieje!");

    const { error } = validateData(req.body);
        if (error) { return res.status(400).send(error.details[0].message); };

    customer.set({
        name: req.body.name,
        secondName: req.body.secondName,
        address: req.body.address,
        postalCode: req.body.postalCode,
        city: req.body.city,
        telephone: req.body.telephone
    });
    try {
        await customer.save();
        res.send({
            login: customer.login,
            email: customer.email,
            name: customer.name,
            secondName: customer.secondName,
            address: customer.address,
            postalCode: customer.postalCode,
            city: customer.city,
            telephone: customer.telephone,
            message: "Adres dodany poprawnie."});
    } catch (error) { res.status(400).send(error); }
};

updatePassword = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) { return res.status(404).send("Użytkownik nie istnieje."); }

    const password = await bcrypt.compare(req.body.currentPassword, customer.password);
    if(!password) { return res.status(400).send("Podane hasło nie jest prawidłowe."); }

    if(req.body.password != req.body.confirmPassword) { return res.status(400).send("Hasła muszą być identyczne"); }

    let { error } = validatePassword({password: req.body.password, confirmPassword: req.body.confirmPassword});
        if (error) { 
            return res.status(400).send(error.details[0].message); };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    customer.set({
        password: hashedPassword
    });

    try {
        await customer.save();
        res.send({ message: "Hasło poprawnie zaktualizowane" });
    } catch (error) { res.status(400).send(error); }

}

updateCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("Użytkownik nie istnieje.");

    const data = {
        name: req.body.name,
        secondName: req.body.secondName,
        address: req.body.address,
        postalCode: req.body.postalCode,
        city: req.body.city,
        telephone: req.body.telephone
    };

    const auth = {
        email: req.body.email,
        login: req.body.login
    }

    let { error } = validateData(data);
        if (error) { 
            return res.status(400).send(error.details[0].message); };
    
    let { err } = validateCustomerUpdate(auth);
        if (err) { return res.status(400).send(err.details[0].message); }


    const login = await Customer.findOne({login: req.body.login});
    if(login && login._id != req.params.id) { return res.status(400).send("Taki login jest już zajęty przez innego użytkownika, podaj inny.")};
    const email = await Customer.findOne({email: req.body.email});
    if(email && email._id != req.params.id) { return res.status(400).send("Taki email jest już zajęty przez innego użytkownika, podaj inny.")};


    customer.set({
        login: req.body.login,
        email: req.body.email,
        name: req.body.name,
        secondName: req.body.ssecondName,
        address: req.body.address,
        postalCode: req.body.postalCode,
        city: req.body.city,
        telephone: req.body.telephone
    });

    try {
        await customer.save();
        res.send({
            login: req.body.login,
            email: req.body.email,
            name: req.body.name,
            secondName: req.body.ssecondName,
            address: req.body.address,
            postalCode: req.body.postalCode,
            city: req.body.city,
            telephone: req.body.telephone,
            message: "Użytkownik poprawnie zaktualizowany."});
    } catch (error) { res.status(400).send(error); }
};

deleteCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) { return res.status(400).send("Użytkownik nie istnieje."); };

    res.send({ message: `Użytkownik ${customer.login} o ID ${customer._id} poprawnie usunięty.` });
}

module.exports = {getCustomers, getCustomer, addCustomer, loginCustomer, addData, updatePassword, updateCustomer, deleteCustomer};