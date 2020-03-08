import React from 'react';
import Header from './Header';
import Footer from './Footer';

class Contact extends React.Component {

    render() {
        return(
            <div>
                <Header/>
                <div className="contact-overall">
                <div className="contact-container">
                    <p className="contact-item">Adres: ul. Pomorska 33</p>
                    <p className="contact-item">Telefon: </p>
                </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Contact