const {Payment, validatePayment} = require('../models/payment');

getPayments = async (req, res) => {
    const payments = await Payment.find().sort('name')
    if(!payments) { return res.status(404).send("Brak zadeklarowanych metod płatności")};
    res.send(payments);
};

getPayment = async (req, res) => {
    
    let payment = await Payment.findOne({"ID": req.params.id});

    if(!payment) return res.status(404).send('Nie ma takiej metody płatności.');
    console.log(payment)

    res.send(payment);
};

addPayment = async (req, res) => {

    const { error } = validatePayment(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const checkPayment = await Payment.findOne({name: req.body.name});
    if(checkPayment) { return res.status(400).send("Rodzaj płatności o takie nazwie już istnieje! Podaj inną.")};
    let currentNumber;
    let payments = await Payment.find();
    if (payments.length===0) { currentNumber = 1} else {
    let lastElementIndex = payments.length -1;
    currentNumber = payments[lastElementIndex].ID +1;
    }

    const newPayment = new Payment({
        name: req.body.name,
        ID: currentNumber
    });
    try { 
        await newPayment.save();
        res.send({
            message: "Nowa metoda płatności utworzona",
            name: newPayment.name,
            ID: currentNumber
        });
    } catch (error) { res.status(400).send(error); }

};

updatePayment = async (req, res) => {

    const payment = await Payment.findById(req.params.id);
    if(!payment) { return res.status(404).send('Nie ma takiej metody płatności.')};

    const { error } = validatePayment(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let existPayment = await Payment.findOne({name: req.body.name});
    if (existPayment && existPayment._id != payment._id) { return res.status(400).send("Metoda płatności o takiej nazwie już istnieje. Podaj inną.")};

    payment.set({
        name: req.body.name,
    });

    try {
        await payment.save();
        res.send({
            name: payment.name,
            ID: payment.ID,
            message: "Metoda płatności zaktualizowana"
        });
    } catch (error) { return res.status(400).send(error); }
};

deletePayment = async (req, res) => {

    
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if(!payment) { return res.status(400).send("Metoda płatności nie istnieje nie istnieje.")};
    
    res.send({ message: `Płatność o nazwie ${payment.name} została usunięta.` });

};

module.exports = {getPayments, getPayment, addPayment, updatePayment, deletePayment};
