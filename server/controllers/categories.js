const {Category, validateCategory} = require('../models/category');
const {Product} = require('../models/product');
getCategories = async (req, res) => {
    const categories = await Category.find().sort('name')
    res.send(categories);
};

getCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).send('Nie ma takiej kategorii.');
    res.send(category);
};

addCategory = async (req, res) => {

    const { error } = validateCategory(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const checkCategory = await Category.findOne({name: req.body.name});
    if(checkCategory) { return res.status(400).send("Kategoria o takiej nazwie już istnieje.")};
    

    const newCategory = new Category({
        name: req.body.name
    });
    try { 
        await newCategory.save();
        res.send({
            message: "Nowa kategoria utworzona",
            name: newCategory.name
        });
    } catch (error) { res.status(400).send(error); }

};

updateCategory = async (req, res) => {

    const category = await Category.findById(req.params.id);
    if(!category) { return res.status(400).send("Kategoria nie istnieje.")};

    const { error } = validateCategory(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    existCategory = await Category.findOne({name: req.body.name});
    if (existCategory && existCategory._id != category._id) { return res.status(400).send("Kategoria o takiej nazwie już istnieje.")};

    category.set({
        name: req.body.name
    });

    try {
        await category.save();
        res.send({
            name: category.name,
            message: "Kategoria zaktualizowana"
        });
    } catch (error) { return res.status(400).send(error); }
};

deleteCategory = async (req, res) => {

    const product = await Product.findOne({"category._id": req.params.id});
    console.log(product)
    if(product) {return res.status(400).send("Nie można usunąć kategorii, która jest przypisana do produktów.")};
    
    const category = await Category.findByIdAndDelete(req.params.id);
    if(!category) { return res.status(400).send("Kategoria nie istnieje.")};
    
    res.send({ message: `Kategoria o nazwie ${category.name} została usunięta.` });

};

module.exports = {getCategories, getCategory, addCategory, updateCategory, deleteCategory};
