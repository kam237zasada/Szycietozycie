const {Status, validateStatus} = require('../models/status');

getStatuses = async (req, res) => {
    const statuses = await Status.find().sort('type')
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
    let isDefault= req.body.isDefault;
    let currentNumber;
    let statuses = await Status.find();
    if (statuses.length===0) { currentNumber = 1
    isDefault=true} else {
    let lastElementIndex = statuses.length -1;
    currentNumber = statuses[lastElementIndex].ID +1;
    }

    const newStatus = new Status({
        name: req.body.name,
        ID: currentNumber,
        type: req.body.type,
        isDefault: isDefault
    });
    try { 
        await newStatus.save();
        res.send({
            message: "Nowy status utworzony",
            name: newStatus.name,
            ID: currentNumber,
            type: newStatus.type,
            isDefault: newStatus.isDefault
        });
    } catch (error) { res.status(500).send("Coś poszło nie tak"); }

};

updateStatus = async (req, res) => {

    const status = await Status.findById(req.params.id);
    if(!status) { return res.status(404).send('Nie ma takiego statusu.')};


    const { error } = validateStatus(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let existStatus = await Status.findOne({name: req.body.name});
    if (existStatus && existStatus._id != req.params.id) { return res.status(400).send("Status o takiej nazwie już istnieje. Podaj inną.")};

    if(req.body.isDefault===true) {
        let currentDefaultStatus = await Status.findOne({"isDefault": true});
    if(req.params.id != currentDefaultStatus._id) {
        currentDefaultStatus.isDefault=false;
    try {
        await currentDefaultStatus.save();
    } catch(err) {
        return res.status(500).send("Coś poszło nie tak")
    }
    }
}
    status.set({
        name: req.body.name,
        type: req.body.type,
        isDefault: req.body.isDefault
    });


    try {
        await status.save();
        res.send({
            name: status.name,
            ID: status.ID,
            type: status.type,
            isDefault: status.isDefault,
            message: "Status zaktualizowany"
        });
    } catch (error) { return res.status(500).send("Cos poszło nie tak"); }

};

deleteStatus = async (req, res) => {

    
    const status = await Status.findByIdAndDelete(req.params.id);
    if(!status) { return res.status(400).send("Status nie istnieje.")};
    if(status.isDefault===true) { return res.status(400).send("Nie możesz usunąć statusu, gdy jest ustawiony jako domyślny")}
    
    res.send({ message: `Status o nazwie ${status.name} został usunięty.` });

};

module.exports = {getStatuses, getStatus, addStatus, updateStatus, deleteStatus};
