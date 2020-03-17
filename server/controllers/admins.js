const bcrypt = require('bcrypt');
const {Admin, validateAdmin, validatePassword, validateUpdate} = require('../models/admin');


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

    let findEmail = await Admin.findOne({email: req.body.email});

    if(findEmail) {
        return res.status(400).send('Administrator o takim adresie email jest już zarejestrowany.');
    }

    if (req.body.password != req.body.confirmPassword) {
        return res.status(400).send('Hasła w polach "hasło" oraz "potwierdź hasło" muszą byc identyczne.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newAdmin = new Admin({
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword
    });

    try {
        await newAdmin.save();
        res.send({
            message: "Nowy administrator dodany.",
            email: newAdmin.email,
            name: newAdmin.name,
            _id: newAdmin._id
        });
    
    } catch (error) { res.status(400).send(error);}
};

loginAdmin = async (req, res) => {
    const admin = await Admin.findOne({email: req.body.email});
    if(!admin) { return res.status(400).send("Podany email lub hasło są niepoprawne.")};

    const checkPassword = await bcrypt.compare(req.body.password, admin.password);
    if(!checkPassword) { return res.status(400).send("Podany email lub hasło są niepoprawne.")};
    
    res.send({
        message: `Administrator ${admin.name} zalogowany poprawnie.`,
        name: admin.name,
        email: admin.email,
        _id: admin._id
    })
};

updatePassword = async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if(!admin) return res.status(404).send("Administrator nie istnieje.");

    const password = await bcrypt.compare(req.body.currentPassword, admin.password);
    if(!password) return res.status(400).send("Podane hasło nie jest prawidłowe.");

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
    } catch (error) { res.status(400).send(error); }

}

updateAdmin = async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if(!admin) return res.status(404).send("Administrator nie istnieje.");

    let { error } = validateUpdate({name: req.body.name, email: req.body.email});
        if (error) { 
            return res.status(400).send(error.details[0].message); };

    
    const email = await Admin.findOne({email: req.body.email});
    if(email && email._id != req.params.id) { return res.status(400).send("Istnieje już administrator o takim adresie email, proszę podać inny.")};


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
    } catch (error) { res.status(400).send(error); }
};

deleteAdmin = async (req, res) => {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    res.send({
        message: `Administrator ${admin.name} o ID ${req.params.id} usunięty poprawnie.`
    });
}


module.exports = {getAdmins, getAdmin, addAdmin, loginAdmin, updatePassword, updateAdmin, deleteAdmin};