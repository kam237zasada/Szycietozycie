const {Status, validateStatus} = require('../models/status');

getStatuses = async (req, res) => {
    const statuses = await Status.find().sort('ID')
    if(!statuses) { return res.status(404).send("Brak zadeklarowanych statusów")};
    res.send(statuses);
};

getStatus = async (req, res) => {
    
    let status = await Status.findOne({"ID": req.params.id});

    if(!status) return res.status(404).send('Nie ma takiego statusu.');

    res.send(status);
};

addStatus = async (req, res) => {

    const { error } = validateStatus(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const checkStatus = await Status.findOne({name: req.body.name});
    if(checkStatus) { return res.status(400).send("Status o takie nazwie już istnieje! Podaj inną.")};
    let currentNumber;
    let statuses = await Status.find();
    if (statuses.length===0) { currentNumber = 1} else {
    let lastElementIndex = statuses.length -1;
    currentNumber = statuses[lastElementIndex].ID +1;
    }

    const newStatus = new Status({
        name: req.body.name,
        ID: currentNumber
    });
    try { 
        await newStatus.save();
        res.send({
            message: "Nowy status utworzony",
            name: newStatus.name,
            ID: currentNumber
        });
    } catch (error) { res.status(400).send(error); }

};

updateStatus = async (req, res) => {

    const status = await Status.findById(req.params.id);
    if(!status) { return res.status(404).send('Nie ma takiego statusu.')};

    const { error } = validateStatus(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let existStatus = await Status.findOne({name: req.body.name});
    if (existStatus && existStatus._id != status._id) { return res.status(400).send("Status o takiej nazwie już istnieje. Podaj inną.")};

    status.set({
        name: req.body.name,
    });

    try {
        await status.save();
        res.send({
            name: status.name,
            ID: status.ID,
            message: "Status zaktualizowany"
        });
    } catch (error) { return res.status(400).send(error); }
};

deleteStatus = async (req, res) => {

    
    const status = await Status.findByIdAndDelete(req.params.id);
    if(!status) { return res.status(400).send("Status nie istnieje.")};
    
    res.send({ message: `Status o nazwie ${status.name} został usunięty.` });

};

module.exports = {getStatuses, getStatus, addStatus, updateStatus, deleteStatus};
