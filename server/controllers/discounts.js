const {Discount, validateDiscount} = require('../models/discount');
const {Customer} = require('../models/customer');

getDiscount = async (req, res) => {
    const discount = await Discount.findOne({ID: req.params.id});
    if(!discount) { return res.status(400).send("Nie ma takiego kodu rabatowego")}

    res.send(discount)
}

getDiscounts = async (req, res) => {
    const discounts = await Discount.find();
    if(!discounts) { return res.status(400).send("Brak zdefiniowanych kodów rabatowych. Dodaj pierwszy!")}

    res.send(discounts)
}

checkDiscount = async (req, res) => {
    const discount = await Discount.findOne({code: req.params.code});
    if(!discount || !discount.active) { return res.status(400).send("Nie ma takiego kodu rabatowego");}
    if(discount.mustLogin && !req.body.customerId) { return res.status(400).send("Musisz się zalogować, by móc skorzystać z tego kodu rabatowego")}

    if(discount.isSingleUse) {
        if(discount.usedBy.length>0) { return res.status(400).send("Nie ma takiego kodu rabatowego")}
    }

    if(discount.isSingleByUser) {
        for(let i =0; i<discount.usedBy.length; i++) {
            if(discount.usedBy[i]==req.body.customerId) {
                return res.status(400).send("Skorzystałeś już z tego kodu rabatowego");
            }
        }
    }

    try {
        res.send(discount)
    } catch(err) {
        res.status(500).send("Coś poszło nie tak, spróbuj ponownie")
    }
}

addDiscount = async (req, res) => {
    const validation = validateDiscount(req.body);
        if (validation.error) {
            return res.status(400).send(validation.error.details[0].message);
        };

        let findDiscount = await Discount.findOne({code: req.body.code}) 
        if(findDiscount) { return res.status(404).send("Taki kod rabatowy już istnieje, musisz podać inny")}
        let currentNumber;
        let discounts = await Discount.find();
        if(discounts.length===0) { currentNumber = 1} else {
        let lastElementIndex = discounts.length -1;
        currentNumber = discounts[lastElementIndex].ID +1;
        }

        const newDiscount = new Discount({
            ID: currentNumber,
            name: req.body.name,
            code: req.body.code,
            type: req.body.type,
            value: req.body.value,
            isInfinite: req.body.isInfinite,
            active: req.body.active,
            isSingleUse: req.body.isSingleUse,
            isSingleByUser: req.body.isSingleByUser,
            mustLogin: req.body.mustLogin
        })

        try {
            await newDiscount.save();
            res.send({
                message: "Dodano pomyślnie nowy kod rabatowy",
                newDiscount
            }) }
            catch(err) {
                return res.status(500).send("Coś poszło nie tak")
            }

}

updateDiscount = async (req,res) => {
    const discount = await Discount.findById(req.params.id)
    if(!discount) { return res.status(400).send("Taki kod rabatowy nie istnieje")};

    let findDiscount = await Discount.findOne({code: req.body.code}) 
    if(findDiscount && findDiscount._id != req.params.id) { return res.status(404).send("Taki kod rabatowy już istnieje, musisz podać inny")}

    const validation = validateDiscount(req.body);
    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message);
    };

    discount.set({
        name: req.body.name,
        code: req.body.code,
        type: req.body.type,
        value: req.body.value,
        isInfinite: req.body.isInfinite,
        active: req.body.active,
        isSingleUse: req.body.isSingleUse,
        isSingleByUser: req.body.isSingleByUser,
        mustLogin: req.body.mustLogin
    })

    try {
        await discount.save();
        res.send({
            discount,
            message: "Kod poprawnie zaktualizowany."});
    } catch (error) { res.status(500).send("Coś poszło nie tak"); }

}

deleteDiscount = async (req, res) => {
    const discount = await Discount.findByIdAndDelete(req.params.id)
    if(!discount) { return res.status(400).send("Taki kod rabatowy nie istnieje")};

    res.send({ message: `Kod rabatowy ${discount.name} o ID ${req.params.id} usunięty poprawnie.` });
}

module.exports = {
    getDiscount,
    getDiscounts,
    checkDiscount,
    addDiscount,
    updateDiscount,
    deleteDiscount
}