import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';


class Contact extends React.Component {

    componentDidMount = () => {
        let head = document.getElementsByTagName("head");
        let title = document.getElementsByTagName("title");
        title[0].innerHTML = "Kontakt - Szycie to Życie";
        let description = document.createElement("meta");
        description.setAttribute("name", "description");
        description.setAttribute("content", "Szycie to Życie, godziny otwarcia, jak dojechać");
        head[0].appendChild(description)
    }

    render() {
        return(
            <div>
                <Header/>
                <div className="contact-overall">
                <div className="contact-container">
                    <h3 className="contact-item">Szycie to Życie</h3>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> ul. Ulicowa 12</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> 00-000 Miasto</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> NIP: 0001112233</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Telefon: 111 222 333</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Email: sklep@przykladowymail.pl</p>
                    <h3 className="contact-item">Godziny otwarcia:</h3>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Poniedziałek: 9-19</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Wtorek: 9-19</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Środa: 9-19</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Czwartek: 9-19</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Piątek: 9-19</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Sobota: 10-14</p>
                    <p className="contact-item"><FontAwesomeIcon className="square-icon" icon={faSquare}/> Niedziela: nieczynne</p>
                    <h3 className="contact-item">Jak dojechać:</h3>
                    <p className="contact-item">Lokal mieści się w samym centrum Sahary, wystarczy dolecieć samolotem do Kairu, nastepnie znaleźć Pana Ahmeda El-Emery, on wypożyczy wam wielbłąda, który wie jak trafić do wulkanu Waw an Namus, a stamtąd już tylko około 1500 kilometrów.</p>
                    <iframe className="map contact-item" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18107466.040266067!2d-5.219435043237892!3d19.547798942051458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDMyJzUyLjEiTiAzwrA0NCc0My41IkU!5e1!3m2!1spl!2spl!4v1611406064288!5m2!1spl!2spl" width="400" height="300" frameBorder="0" style={{border:0}} allowFullScreen=""></iframe>
                </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Contact