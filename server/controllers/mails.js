const {Mail, validateMail} = require('../models/category');
const templates = require('../emailTemplates/templates');
const request = require('request');
const { appKey, secretKey } = require('../config/index');

orderMessage = async (req, res) => {
    const mail = req.body.email;
        try {
            await request.post({
        url: 'https://api.emaillabs.net.pl/api/new_sendmail',
        headers: {
            'content-type' : 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + new Buffer.from(`${appKey}:${secretKey}`).toString("base64")
        },
        form: {
            to: {
                [mail]: ''
            },
            'subject': `Numer listu dla Twojego zamówienia nr ${req.body.data.orderId}`,
            'html':templates.orderMessage({waybill: req.body.data.waybill, shipmentCompany: req.body.data.shipmentCompany, message: req.body.data.message}),
            'smtp_account': '1.kam237zasada.smtp',
            'from': 'kam237zasada@wp.pl'
        }
    },
    function (error, response, body) {
        console.log(body)
    }
    )
    res.status(200).send("Wiadomość wysłana")
} catch(err) {
    res.status(500).send("coś poszło nie tak");
}

}

productQuestion = async (req, res) => {
    

    try {
        await request.post({
    url: 'https://api.emaillabs.net.pl/api/new_sendmail',
    headers: {
        'content-type' : 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + new Buffer.from(`${appKey}:${secretKey}`).toString("base64")
    },
    form: {
        to: {
            'sklep@torebkowamania.pl': ''
        },
        'subject': `Nowe pytanie o produkt ${req.body.data.productName}`,
        'html':templates.productQuestion({message: req.body.data.message, link: req.body.data.link, email: req.body.email, productName: req.body.data.productName}),
        'smtp_account': '1.kam237zasada.smtp',
        'from': 'kam237zasada@wp.pl',
        'reply_to': req.body.email

    }
},
function (error, response, body) {
    console.log(body)
}
)
res.status(200).send("Wiadomość wysłana")
} catch(err) {
res.status(500).send("coś poszło nie tak");
}

}

module.exports = {orderMessage, productQuestion};
