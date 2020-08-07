import React from 'react';

class NavigationBar extends React.Component {

    onHover = e => {

        switch(e.target.id) {
            case 'sales':
            document.getElementById('hover-sales').style.display="flex";
            document.getElementById('hover-products').style.display="none";
            document.getElementById('hover-settings').style.display="none";
            break;
            case 'products':
            document.getElementById('hover-sales').style.display="none";
            document.getElementById('hover-products').style.display="flex";
            document.getElementById('hover-settings').style.display="none";
            break;
            case 'settings':
            document.getElementById('hover-sales').style.display="none";
            document.getElementById('hover-products').style.display="none";
            document.getElementById('hover-settings').style.display="flex";
            break;
            default:
                break;
        }
    }
    onLeave = e => {
        switch(e.target.id) {
            case 'sales':
            document.getElementById('hover-sales').style.display="none";
            break;
            case 'products':
            document.getElementById('hover-products').style.display="none";
            break;
            case 'settings':
            document.getElementById('hover-settings').style.display="none";
            break;
            default:
                break;
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
                    <div className="panel-hover-item"><a href="/admin/orders/new">Nowe zamówienia</a></div>
                    <div className="panel-hover-item"><a href="/admin/orders/open">Zamówienia otwarte</a></div>
                    <div className="panel-hover-item"><a href="/admin/orders/finalized">Zakończone</a></div>
                    <div className="panel-hover-item"><a href="/admin/customers">Klienci</a></div>
                    <div className="panel-hover-item"><a href="/admin/discounts">Kody Rabatowe</a></div>
                </div></div>
                <div className="panel-navigation-item" id="products" onMouseOver={this.onHover} onMouseLeave={this.onLeave}>
                <a href="/admin/products">Produkty</a>
                <div className="panel-hover" id="hover-products" style={{display: "none"}}>
                    <div className="panel-hover-item"><a href="/admin/products">Wszystkie produkty</a></div>
                    <div className="panel-hover-item"><a href="/admin/products/add">Dodaj produkt</a></div>
                    <div className="panel-hover-item"><a href="/admin/kategorie">Kategorie</a></div>
                    <div className="panel-hover-item"><a href="/admin/variants">Warianty</a></div>
                    <div className="panel-hover-item"><a href="/admin/colors">Kolory</a></div>
                </div></div>
                <div className="panel-navigation-item" id="settings" onMouseOver={this.onHover} onMouseLeave={this.onLeave}>
                <a href="/admin/konfiguracja">Konfiguracja</a>
                <div className="panel-hover" id="hover-settings" style={{display: "none"}}>
                    <div className="panel-hover-item"><a href="/admin/moje-konto">Edytuj dane</a></div>
                    <div className="panel-hover-item"><a href="/admin/admins">Administratorzy</a></div>
                    <div className="panel-hover-item"><a href="/admin/dostawy">Dostawy</a></div>
                    <div className="panel-hover-item"><a href="/admin/platnosci">Płatności</a></div>
                    <div className="panel-hover-item"><a href="/admin/statuses">Statusy zamówień</a></div>
                    <div className="panel-hover-item"><a href="/admin/sites">Strony informacyjne</a></div>
                </div></div>
                
            </div>
        )
    }
}

export default NavigationBar