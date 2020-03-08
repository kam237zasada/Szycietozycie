import React from 'react';

class Footer extends React.Component {

    render() {
        return(
            <div className="footer-container">
                <a href="/o-mnie"><div className="footer-item">O mnie</div></a>
                <a href="/sklep"><div className="footer-item">Sklep</div></a>
                <a href="/cennik"><div className="footer-item">Cennik</div></a>
                <a href="/kontakt"><div className="footer-item">Kontakt</div></a>
                <div className="footer-item sign">© Kamil Zasada 2020</div>
            </div>
        )
    }
}

export default Footer;