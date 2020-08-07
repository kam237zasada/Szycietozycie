const {Variant, validateVariant} = require('../models/variant');
const {Product} = require('../models/product');

getVariants = async (req, res) => {
    const variants = await Variant.find().sort('name')
    if(!variants) {return res.status(400).send("Brak zdefiniowanych wariantów")};
    res.send(variants);
};

getVariant = async (req, res) => {
    
    let variant = await Variant.findOne({"ID": req.params.id});

    if(!variant) return res.status(404).send('Nie ma takiego wariantu.');


    res.send(variant);
};

addVariant = async (req, res) => {

    const { error } = validateVariant(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const checkVariant = await Variant.findOne({name: req.body.name});
    if(checkVariant) { return res.status(400).send("Wariant o takiej nazwie już istnieje.")};
    let currentNumber;
    let variants = await Variant.find();
    if (variants.length===0) { currentNumber = 1} else {
    let lastElementIndex = variants.length -1;
    currentNumber = variants[lastElementIndex].ID +1;
    }

    const newVariant = new Variant({
        name: req.body.name,
        values: req.body.values,
        ID: currentNumber
    });
    try { 
        await newVariant.save();
        res.send({
            message: "Nowy wariant utworzony",
            name: newVariant.name,
            values: newVariant.values,
            ID: currentNumber
        });
    } catch (error) { res.status(400).send(error); }

};

updateVariant = async (req, res) => {

    const variant = await Variant.findById(req.params.id);
    if(!variant) { return res.status(404).send("Wariant nie istnieje.")};


    const { error } = validateVariant(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let existVariant = await Variant.findOne({name: req.body.name});
    if (existVariant && existVariant._id != req.params.id) { return res.status(400).send("Wariant o takiej nazwie już istnieje.")};

    const products = await Product.find({"variant.ID": variant.ID});

    for(let i=0;i<products.length;i++) {
        products[i].set({
            variant: {
                _id: variant._id,
                name: req.body.name,
                values: req.body.values,
                ID: variant.ID
            }
        })
        try {
            await products[i].save()
        } catch(err){
            return res.status(500).send("Coś poszło nie tak")
        }
    }

    variant.set({
        name: req.body.name,
        values: req.body.values
    });

    try {
        await variant.save();
        res.send({
            name: variant.name,
            values: variant.values,
            message: "Wariant zaktualizowany"
        });
    } catch (error) { return res.status(500).send("Coś poszło nie tak"); }
};

deleteVariant = async (req, res) => {
    let id = Number(req.params.IDD)
    let products = await Product.find({"variant.ID":id});
    for(let i=0; i<products.length; i++) {

        products[i].set({
            variant : {
                name: "",
                _id: "",
                ID: "",
                values: []
            }
        })
        try {
        await products[i].save()
        } catch(err) {
            return res.status(500).send("Coś poszło nie tak")
        }
    }    

    variant = await Variant.findByIdAndDelete(req.params.id);
    if(!variant) { return res.status(404).send("Wariant nie istnieje.")};
    
    res.send({ message: `Wariant o nazwie ${variant.name} został usunięty.` });

};

module.exports = {getVariants, getVariant, addVariant, updateVariant, deleteVariant};
