const {Mail, validateMail} = require('../models/category');
const templates = require('../emailTemplates/templates');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

orderMessage = async (req, res) => {
    const msg = {
        to: req.body.email,
        from: 'kam237zasada@wp.pl',
        subject: `Numer listu dla Twojego zamówienia nr ${req.body.data.orderId}`,
        html: templates.orderMessage({waybill: req.body.data.waybill, shipmentCompany: req.body.data.shipmentCompany, message: req.body.data.message})
    }
    try {
        await sgMail.send(msg);
        res.status(200).send("Wiadomość wysłana")
        } catch (err) {
            res.status(500).send("Wystąpił nieoczekiwany błąd, spróbuj później lub sprawdź czy na pewno jest poprawny mail w zamówieniu")
        }
}

productQuestion = async (req, res) => {
    const msg = {
        to: 'kam237zasada@wp.pl',
        from: 'kam237zasada@wp.pl',
        subject: `Nowe pytanie o produkt ${req.body.data.productName}`,
        html: templates.productQuestion({message: req.body.data.message, link: req.body.data.link, email: req.body.email, productName: req.body.data.productName}),
        reply_to: req.body.email
    }
    try {
        await sgMail.send(msg);
        res.status(200).send("Wiadomość wysłana")
        } catch (err) {
            return res.status(500).send("Coś poszło nie tak, spróbuj później. Sprawdź czy na pewno wpisałeś poprawny adres email.")
        }
}

module.exports = {orderMessage, productQuestion};
