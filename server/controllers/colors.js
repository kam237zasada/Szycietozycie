const {Color, validateColor} = require('../models/color');
const {Product} = require('../models/product');

getColors = async (req, res) => {
    const colors = await Color.find().sort('name')
    if(!colors) { return res.status(400).send("Brak zdefiniowanych kolorów")};
    res.send(colors);
};

getColor = async (req, res) => {
    
    let color = await Color.findOne({"ID": req.params.id});

    if(!color) return res.status(404).send('Nie ma takiego koloru.');


    res.send(color);
};

addColor = async (req, res) => {

    const { error } = validateColor(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const checkColor = await Color.findOne({name: req.body.name});
    if(checkColor) { return res.status(400).send("Kolor o takiej nazwie już istnieje.")};
    let currentNumber;
    let colors = await Color.find();
    if (colors.length===0) { currentNumber = 1} else {
    let lastElementIndex = colors.length -1;
    currentNumber = colors[lastElementIndex].ID +1;
    }

    const newColor = new Color({
        name: req.body.name,
        ID: currentNumber
    });
    try { 
        await newColor.save();
        res.send({
            message: "Nowy kolor utworzony",
            name: newColor.name,
            ID: newColor.ID
        });
    } catch (error) { res.status(500).send("Cos poszło nie tak"); }

};

updateColor = async (req, res) => {

    const color = await Color.findById(req.params.id);
    if(!color) { return res.status(400).send("Kolor nie istnieje.")};

    const { error } = validateColor(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let existColor = await Color.findOne({name: req.body.name});
    if (existColor && existColor._id != req.params.id) { return res.status(400).send("Kolor o takiej nazwie już istnieje.")};

    const products = await Product.find({"color": { "$elemMatch": { "_id": req.params.id}}});
    for(let i =0;i<products.length;i++) {
        let colors = products[i].color;
        for(let j =0; j<colors.length; j++) {
            if(color.id==colors[j]._id) {
                colors[j].name=req.body.name
                colors.set(j, colors[j])
            }
            
        }
        try {
            await products[i].save()
        } catch(err) {
            return res.status(500).send("Cos poszło nie tak")
        }
    }
    color.set({
        name: req.body.name
    });

    try {
        await color.save();
        res.send({
            name: color.name,
            message: "Kolor zaktualizowany"
        });
    } catch (error) { return res.status(500).send("Cos poszło nie tak"); }
};

deleteColor = async (req, res) => {
    const products = await Product.find({"color": { "$elemMatch": { "_id": req.params.id}}});
    for(let i =0;i<products.length;i++) {
        let elToDelete = [];
        let colors = products[i].color;
        for(let j =0; j<colors.length; j++) {
            if(req.params.id==colors[j]._id) {
                elToDelete.push(j)
            }
        }
        colors.splice(elToDelete[0], 1)
        try {
            await products[i].save()
        } catch(err) {
            return res.status(500).send("Cos poszło nie tak")
        }
    }
    
    const color = await Color.findByIdAndDelete(req.params.id);
    if(!color) { return res.status(400).send("Kolor nie istnieje.")};
    
    res.send({ message: `Kolor o nazwie ${color.name} została usunięty.` });

};

module.exports = {getColors, getColor, addColor, updateColor, deleteColor};
