import React from 'react';

function OrderSummary(){

    return(
        <div className="summary-container">
            <h2 className="summary-header">Dziękujemy za złożenie zamówienia!</h2>
            <p className="summary-message">Twoje zamówienie zostało poprawnie złożone. Na maila podanego w danych do zamówienia przyszła wiadomość potwierdzająca. W nastepnych wiadomościach będziesz otrzymywać kolejne etapy realizacji zamówienia.</p>
            <div className="summary-button-container">
                <a href="/"><button className="button-basket">Wróć na stronę główną</button></a>
                <a href="/sklep"><button className="button-basket">Wróć do sklepu</button></a>
            </div>
        </div>
        )
}

export default OrderSummary