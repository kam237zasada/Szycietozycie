const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/index')
const {Admin, validateAdmin, validatePassword, validateUpdate} = require('../models/admin');
const { generateTokens } = require('../controllers/auth')
// const { verifyAccessToken } = require('../controllers/auth')


getAdmins = async (req, res) => {
    const admins = await Admin.find().select('-password').sort('dateCreated');
    res.send(admins);
};

getAdmin = async (req, res) => {
    const admin = await Admin.findById(req.params.id).select('-password');

    if (!admin) return res.status(404).send('Administrator nie istnieje.');
    res.send(admin);
};

addAdmin = async (req, res) => {

    const { error } = validateAdmin(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };

    let encoded = jwt.decode(req.headers.token)

    let adminId = encoded.sub;
    const admin = await Admin.findById(adminId);


    const checkPassword = await bcrypt.compare(req.body.adminPassword, admin.password);
    if(!checkPassword) { return res.status(401).send("Błędne dane autoryzacji. Admin nie został dodany!")};


    let findEmail = await Admin.findOne({email: req.body.email});

    if(findEmail) {
        return res.status(400).send('Administrator o takim adresie email jest już zarejestrowany.');
    }

    if (req.body.password != req.body.confirmPassword) {
        return res.status(400).send('Hasła w polach "hasło" oraz "potwierdź hasło" muszą byc identyczne.');
    }

    let currentNumber;
    let admins = await Admin.find();
    if(admins.length===0) { currentNumber = 1} else {
    let lastElementIndex = admins.length -1;
    currentNumber = admins[lastElementIndex].ID +1;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newAdmin = new Admin({
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
        ID: currentNumber
    });

    try {
        await newAdmin.save();
        res.send({
            message: "Nowy administrator dodany.",
            email: newAdmin.email,
            name: newAdmin.name,
            ID: newAdmin.ID,
            _id: newAdmin._id
        });
    
    } catch (error) { res.status(500).send("Coś poszło nie tak");}
};

loginAdmin = async (req, res) => {
    const admin = await Admin.findOne({email: req.body.email});
    if(!admin) { return res.status(400).send("Podany email lub hasło są niepoprawne.")};

    const checkPassword = await bcrypt.compare(req.body.password, admin.password);
    if(!checkPassword) { return res.status(400).send("Podany email lub hasło są niepoprawne.")};
    
    let tokens = generateTokens(req, admin)
    res.send({
        message: `Administrator ${admin.name} zalogowany poprawnie.`,
        name: admin.name,
        email: admin.email,
        _id: admin._id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    })
};

updatePassword = async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if(!admin) return res.status(404).send("Administrator nie istnieje.");

    let encoded = jwt.decode(req.headers.token)

    let currentAdminId = encoded.sub;
    let currentAdmin = await Admin.findById(currentAdminId);
    
    const password = await bcrypt.compare(req.body.adminPassword, currentAdmin.password);
    if(!password) return res.status(400).send("Błędne dane autoryzacji. Hasło nie zostało zasktualizowane.");

    if(req.body.password != req.body.confirmPassword) return res.status(400).send('Pole "nowe hasło" i "potwierdź nowe hasło" muszą być takie same.');

    let { error } = validatePassword({password: req.body.password, confirmPassword: req.body.confirmPassword});
        if (error) { 
            return res.status(400).send(error.details[0].message); };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    admin.set({
        password: hashedPassword
    });

    try {
        await admin.save();
        res.send({
            message: "Hasło zaktualizowane."
        });
    } catch (error) { res.status(500).send("Cos poszło nie tak"); }

}

updateAdmin = async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if(!admin) return res.status(404).send("Administrator nie istnieje.");

    let { error } = validateUpdate({name: req.body.name, email: req.body.email});
        if (error) { 
            return res.status(400).send(error.details[0].message); };

    
    const email = await Admin.findOne({email: req.body.email});
    if(email && email._id != req.params.id) { return res.status(400).send("Istnieje już administrator o takim adresie email, proszę podać inny.")};

    let encoded = jwt.decode(req.headers.token)

    let currentAdminId = encoded.sub;
    let currentAdmin = await Admin.findById(currentAdminId);

    const password = await bcrypt.compare(req.body.adminPassword, currentAdmin.password);
    if(!password) return res.status(400).send("Błędne dane autoryzacji. Admin nie został zaktualizowany.");

    admin.set({
        email: req.body.email,
        name: req.body.name
    });

    try {
        await admin.save();
        res.send({
            email: admin.email,
            name: admin.name,
            message: "Dane poprawnie zaktualizowane."
        });
    } catch (error) { res.status(500).send("Cos poszło nie tak"); }
};

deleteAdmin = async (req, res) => {
    let encoded = jwt.decode(req.headers.token)

    let currentAdminId = encoded.sub;
    let currentAdmin = await Admin.findById(currentAdminId);

    const password = await bcrypt.compare(req.headers.password, currentAdmin.password);
    if(!password) return res.status(400).send("Błędne dane autoryzacji. Admin nie został zaktualizowany.");

    const admin = await Admin.findByIdAndDelete(req.params.id);

    res.send({
        message: `Administrator ${admin.name} o ID ${req.params.id} usunięty poprawnie.`
    });
}


module.exports = {getAdmins, getAdmin, addAdmin, loginAdmin, updatePassword, updateAdmin, deleteAdmin};