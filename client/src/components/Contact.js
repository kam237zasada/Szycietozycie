import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
class Contact extends React.Component {

    render() {
        return(
            <div>
                <Header/>
                <div className="contact-overall">
                <div className="contact-container">
                    <h3 className="contact-item">Pracownia Krawiecka "Torebkowa Mania" Aneta Kubisiewicz</h3>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> ul. Pomorska 31a</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> 50-216 Wrocław</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> NIP: 9151039312</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Telefon: 784 015 949</p>
                    <h3 className="contact-item">Godziny otwarcia:</h3>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Poniedziałek: 10-16</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Wtorek: 10-16</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Środa: 10-16</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Czwartek: 10-16</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Piątek: 10-16</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Sobota: Nieczynne</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Niedziela: nieczynne</p>
                    <h3 className="contact-item">Jak dojechać:</h3>
                    <p className="contact-item">Lokal mieści się bardzo niedaleko centrum miasta, około 15 minut pieszo od rynku. Łatwo dojechać tramwajami nr: 0L, 0P, 6, 7, 14, 15, 23, 24 oraz autobusami nr: 128, 144, C.</p>
                    <iframe className="map contact-item" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2504.423383735829!2d17.03129117940313!3d51.119098090329274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470fe9e76f747783%3A0x66e9bf1bbdf8ce81!2sPomorska%2031%2C%2052-007%20Wroc%C5%82aw!5e0!3m2!1spl!2spl!4v1596605850535!5m2!1spl!2spl" width="400" height="300" frameBorder="0" style={{border:0}} allowFullScreen=""></iframe>
                </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Contact