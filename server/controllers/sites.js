const {Site, validateSite} = require('../models/site');

getSites = async (req, res) => {
    const sites = await Site.find().sort('category')

    if(!sites) { res.status(400).send("Brak zdefiniowanych stron informacyjnych, dodaj pierwszą!")}
    res.send(sites);
};

getSitesByCategory = async (req, res) => {
    const sites = await Site.find({category: req.params.category}).sort('ID') 
    if(!sites) { res.status(400).send("Brak stron informacyjnych w tej kategorii! dodaj pierwszą!")}
    res.send(sites);
}

getSite = async (req, res) => {
    
    let site = await Site.findOne({"ID": req.params.id});

    if(!site) return res.status(404).send('UUPS. Ta strona jest pusta!');


    res.send(site);
};

addSite = async (req, res) => {

    const { error } = validateSite(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const checkSite = await Site.findOne({name: req.body.name});
    if(checkSite) { return res.status(400).send("Strona informacyjna o takiej nazwie juz istnieje. Musisz podać inną")};
    let currentNumber;
    let sites = await Site.find();
    if (sites.length===0) { currentNumber = 1} else {
    let lastElementIndex = sites.length -1;
    currentNumber = sites[lastElementIndex].ID +1;
    }

    const newSite = new Site({
        name: req.body.name,
        content: req.body.content,
        ID: currentNumber,
        category: req.body.category
    });
    try { 
        await newSite.save();
        res.send({
            message: "Nowa strona utworzona",
            name: newSite.name, 
            content: newSite.content,
            ID: newSite.ID, 
            category: newSite.category
        });
    } catch (error) { res.status(500).send("Cos poszło nie tak"); }

};

updateSite = async (req, res) => {

    const site = await Site.findById(req.params.id);
    if(!site) { return res.status(404).send('Nie ma takiej strony informacyjnej.')};

    const { error } = validateSite(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    let existSite = await Site.findOne({name: req.body.name});
    if (existSite && existSite._id != req.params.id) { return res.status(400).send("Strona o takiej nazwie już istnieje, musisz podać inną.")};

    site.set({
        name: req.body.name,
        content: req.body.content,
        category: req.body.category
    });
    
    try {
        await site.save();
        res.send({
            _id: site._id,
            name: site.name, 
            content: site.content, 
            ID: site.ID,
            category: site.category,
            message: "Strona zaktualizowana"
        });
    } catch (error) { return res.status(500).send("Coś poszło nie tak"); }
};

deleteSite = async (req, res) => {

    
    const site = await Site.findByIdAndDelete(req.params.id);
    if(!site) { return res.status(400).send("Strona nie istnieje.")};
    
    res.send({ message: `Strona informacyjna o nazwie ${site.name} została usunięta.` });

};

module.exports = {getSites, getSitesByCategory, getSite, addSite, updateSite, deleteSite};
