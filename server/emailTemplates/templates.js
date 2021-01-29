const { baseURL } = require ('../config/index')

exports.placedOrder = (data) => {

    return `<p><strong>Gratulacje! Właśnie złożyłeś zamówienie w sklepie Szycie to życie!</strong></p>
    <p>Numer zamówienia: <strong>${data.orderId}</strong></p>
    <p>Wartość całkowita zamówienia: <strong>${data.value} </strong></p>
    <p>Wybrany sposób dostawy: <strong>${data.shipment}</strong>.<br />Wybrana metoda płatności: <strong>${data.payment}</strong></p>
    <p>Jeżeli wybrałeś formę płatności Przelew tradycyjny, to proszę dokonać przelewu na poniższe dane:<br /><br />Tytuł przelewu: Zamówienie nr ${data.orderId}<br />Numer konta: 11 2222 4444 7777 8888 9999 1111<br />Szycie to życie<br />Ulica 12<br />00-000 Miasto</p><br />
    <p>Pod tym linkiem znajdziesz szczegóły Twojego zamówienia: <a href=${data.link}>${data.link}</a></p><br />
    <p><br /><br /> Dziękujemy, że pomagasz nam tworzyć historię i pozdrawiamy!</p>
    <p><br /> <em>Zespół Szycie to Życie</em></p>
    <p><em>Telefon: 111 222 333</em></p>`
    
}

exports.statusChanged = (data) => {
    //oczekiwanie na płatność
    if(data.status.ID===2) {
        return `<p><strong>Twoje zamówienie nr ${data.orderId} ma obecnie status ${data.status.name}<br /></strong></p>
        <p>Jeżeli wybrałeś formę płatności Przelew tradycyjny, to proszę dokonać przelewu na poniższe dane:<br /><br />Tytuł przelewu: Zamówienie nr ${data.orderId}<br />Numer konta: 11 2222 4444 7777 8888 9999 1111<br />Szycie to życie<br />Ulica 12<br />00-000 Miasto</p>
        <p>Po dokonaniu płatności i zaksięgowaniu jej na koncie, przejdziemy do realizacji Twojego zamówienia, o czym zostaniesz poinformowany w następnych wiadomościach!</p>
        <p><br /><br /> Dziękujemy, że pomagasz nam tworzyć historię i pozdrawiamy!</p>
        <p><br /> <em>Zespół Szycie to Życie</em></p>
        <p><em>Telefon: 111 222 333</em></p>`
    }
    //przyjęte do realizacji
    if(data.status.ID===3) {
        return `<p><strong>Twoje zamówienie nr ${data.orderId} ma obecnie status ${data.status.name}</strong></p>
        <p>Właśnie przyjęliśmy do realizacji Twoje zamówienie! Już niedługo zostanie ono przygotowane do wysyłki i wyruszy w drogę do Ciebie! </p>
        <p><br /><br /> Dziękujemy, że pomagasz nam tworzyć historię i pozdrawiamy!</p>
        <p><br /> <em>Zespół Szycie to Życie</em></p>
        <p><em>Telefon: 111 222 333</em></p>`
    }
    //w trakcie kompletowania
    if(data.status.ID===4) {
        return `<p><strong>Twoje zamówienie nr ${data.orderId} ma obecnie status ${data.status.name}</strong></p>
        <p>W tym momencie kompletujemy Twoje zamówienie, jak tylko zostanie odpowiednio przygotowane, to wyruszy w drogę do Ciebie!</p>
        <p><br /><br /> Dziękujemy, że pomagasz nam tworzyć historię i pozdrawiamy!</p>
        <p><br /> <em>Zespół Szycie to Życie</em></p>
        <p><em>Telefon: 111 222 333</em></p>`
    }
    //gotowe do wysłania
    if(data.status.ID===5) {
        return `<p><strong>Twoje zamówienie nr ${data.orderId} ma obecnie status ${data.status.name}</strong></p>
        <p>Twoje zamówienie zostało już zapakowane i czeka aż kurier je odbierze! To już prawie ostatni krok!</p>
        <p><br /><br /> Dziękujemy, że pomagasz nam tworzyć historię i pozdrawiamy!</p>
        <p><br /> <em>Zespół Szycie to Życie</em></p>
        <p><em>Telefon: 111 222 333</em></p>`
    }
    //wysłane
    if(data.status.ID===6) {
        return `<p><strong>Twoje zamówienie nr ${data.orderId} ma obecnie status ${data.status.name}</strong></p>
        <p>No i... poszło! Twoje zakupy właśnie rozpoczęły podróż do Ciebie. Dosłownie za parę chwil będziesz mógł cieszyć się z zakupionych produktów!</p>
        <p><br /><br /> Dziękujemy, że pomagasz nam tworzyć historię i pozdrawiamy!</p>
        <p><br /> <em>Zespół Szycie to Życie</em></p>
        <p><em>Telefon: 111 222 333</em></p>`
    }
    //anulowane
    if(data.status.ID===7) {
        return `<p><strong>Twoje zamówienie nr ${data.orderId} ma obecnie status ${data.status.name}</strong></p>
        <p>Szkoda, że zamówienie nie doszło do skutku, mamy nadzieję, że niedługo się znów zobaczymy :)</p>
        <p><br /><br /> Dziękujemy, że pomagasz nam tworzyć historię i pozdrawiamy!</p>
        <p><br /> <em>Zespół Szycie to Życie</em></p>
        <p><em>Telefon: 111 222 333</em></p>`
    }
}

exports.orderMessage = (data) => {
    return `<p>Twoje zamówienie zostało już przygotowane do nadania, firma, którą zostanie wysłane to: ${data.shipmentCompany}, nr listu przewozowego: ${data.waybill}</p>
    <p>${data.message}</p>`
}

exports.productQuestion = (data) => {
    return `<p>Masz nowe pytanie o produkt ${data.productName}</p>
    <p>Link do produktu: <a href=${data.link}>${data.link}</a></p>
    <p>Nadawca: ${data.email}</p>
    <p>Treść pytania:</p>
    <p>${data.message}</p>`
}

exports.passwordReminder = (data) => {
    return `<p>Cześć ${data.login}! Kliknij w poniższy link aby zresetować hasło do Twojego konta na sklepie Szycie to Życie!</p><br />
    <a href="${baseURL}sklep/password/new/customer/${data._id}/${data.token}">${baseURL}/sklep/password/new/customer/${data._id}/${data.token}</a><br />
    <p>Link z mozliwością zmiany hasła jest aktywny przez jedną godzinę.</p>
    <p>Jeżeli to nie Ty, to zignoruj tę wiadomość.</p><br />
    <p>Pozdrawiamy</p><br />
    <p>Zespół Szycie to Życie</p>`
}