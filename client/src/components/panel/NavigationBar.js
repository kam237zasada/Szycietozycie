import React from 'react';

class NavigationBar extends React.Component {

    onHover = e => {

        switch(e.target.id) {
            case 'sales':
            document.getElementById('hover-sales').style.display="flex";
            document.getElementById('hover-products').style.display="none";
            document.getElementById('hover-settings').style.display="none";
            break
            case 'products':
            document.getElementById('hover-sales').style.display="none";
            document.getElementById('hover-products').style.display="flex";
            document.getElementById('hover-settings').style.display="none";
            break
            case 'settings':
            document.getElementById('hover-sales').style.display="none";
            document.getElementById('hover-products').style.display="none";
            document.getElementById('hover-settings').style.display="flex";
            break
        }
    }
    onLeave = e => {
        switch(e.target.id) {
            case 'sales':
            document.getElementById('hover-sales').style.display="none";
            break
            case 'products':
            document.getElementById('hover-products').style.display="none";
            break
            case 'settings':
            document.getElementById('hover-settings').style.display="none";
            break
        }
    }


    render() {
        return(
            <div className="panel-navigation-container">
                <a href="/admin/home"><div className="panel-navigation-item" id="panel-home">Pulpit</div></a>
                <div className="panel-navigation-item" id="sales" onMouseOver={this.onHover} onMouseLeave={this.onLeave}>
                <a href="/admin/orders/all">Sprzedaż</a>
                <div className="panel-hover" id="hover-sales" style={{display: "none"}}>
                    <div className="panel-hover-item"><a href="/admin/orders/all">Wszystkie zamówienia</a></div>
                    <div className="panel-hover-item"><a href="/admin/orders/open">Zamówienia otwarte</a></div>
                    <div className="panel-hover-item"><a href="/admin/orders/finalize">Zakończone</a></div>
                </div></div>
                <div className="panel-navigation-item" id="products" onMouseOver={this.onHover} onMouseLeave={this.onLeave}>
                <a href="/admin/produkty">Produkty</a>
                <div className="panel-hover" id="hover-products" style={{display: "none"}}>
                    <div className="panel-hover-item"><a href="/admin/produkty">Wszystkie produkty</a></div>
                    <div className="panel-hover-item"><a href="/admin/produkty/dodaj">Dodaj produkt</a></div>
                    <div className="panel-hover-item"><a href="/admin/kategorie">Kategorie</a></div>
                </div></div>
                <div className="panel-navigation-item" id="settings" onMouseOver={this.onHover} onMouseLeave={this.onLeave}>
                <a href="/admin/konfiguracja">Konfiguracja</a>
                <div className="panel-hover" id="hover-settings" style={{display: "none"}}>
                    <div className="panel-hover-item"><a href="/admin/moje-konto">Edytuj dane</a></div>
                    <div className="panel-hover-item"><a href="/admin/administratorzy">Administratorzy</a></div>
                    <div className="panel-hover-item"><a href="/admin/dostawy">Dostawy</a></div>
                    <div className="panel-hover-item"><a href="/admin/platnosci">Płatności</a></div>
                    <div className="panel-hover-item"><a href="/admin/statusy">Statusy zamówień</a></div>
                </div></div>
                
            </div>
        )
    }
}

export default NavigationBar