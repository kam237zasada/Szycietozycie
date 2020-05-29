const {Shipment, validateShipment} = require('../models/shipment');
const {Product} = require('../models/product');

getShipments = async (req, res) => {
    const shipments = await Shipment.find().sort('name')
    res.send(shipments);
};

getShipment = async (req, res) => {
    
    let shipment = await Shipment.findOne({"ID": req.params.id});

    if(!shipment) return res.status(404).send('Nie ma takiej metody wysyłki.');


    res.send(shipment);
};

addShipment = async (req, res) => {

    const { error } = validateShipment(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const checkShipment = await Shipment.findOne({name: req.body.name});
    if(checkShipment) { return res.status(400).send("Rodzaj przesyłki o takie nazwie już istnieje! Podaj inną.")};
    let currentNumber;
    let shipments = await Shipment.find();
    if (shipments.length===0) { currentNumber = 1} else {
    let lastElementIndex = shipments.length -1;
    currentNumber = shipments[lastElementIndex].ID +1;
    }

    const newShipment = new Shipment({
        name: req.body.name,
        price: req.body.price,
        ID: currentNumber
    });
    try { 
        await newShipment.save();
        res.send({
            message: "Nowa dostawa utworzona",
            name: newShipment.name,
            price: newShipment.price,
            ID: currentNumber
        });
    } catch (error) { res.status(400).send(error); }

};

updateShipment = async (req, res) => {

    const shipment = await Shipment.findById(req.params.id);
    if(!shipment) { return res.status(404).send('Nie ma takiej metody wysyłki.')};

    const { error } = validateShipment(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let existShipment = await Shipment.findOne({name: req.body.name});
    if (existShipment && existShipment._id != shipment._id) { return res.status(400).send("Dostawa o takiej nazwie już istnieje.")};

    shipment.set({
        name: req.body.name,
        price: req.body.price
    });

    try {
        await shipment.save();
        res.send({
            name: shipment.name,
            price: shipment.price,
            ID: shipment.ID,
            message: "Dostawa zaktualizowana"
        });
    } catch (error) { return res.status(400).send(error); }
};

deleteShipment = async (req, res) => {

    
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if(!shipment) { return res.status(400).send("Dostawa nie istnieje.")};
    
    res.send({ message: `Dostawa o nazwie ${shipment.name} została usunięta.` });

};

module.exports = {getShipments, getShipment, addShipment, updateShipment, deleteShipment};
