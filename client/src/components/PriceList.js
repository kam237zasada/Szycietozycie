import React from 'react';
import Header from './Header';
import Footer from './Footer';

class PriceList extends React.Component {
    constructor(props) {
        super(props)
        this.state={clicked: 'spodnie'};
    }

    handlePriceButtonClick = async e => {
        e.preventDefault();
        switch(e.target.id) {
            case 'spodnie': 
            this.setState({clicked: 'spodnie'});
            if(window.innerWidth > 768) {document.getElementById("price-list-container").style.backgroundImage= "url('./spodnie.jpg')"}
            else {document.getElementById("price-list-container").style.backgroundImage="none"};
            break;
            case 'sukienka':
            this.setState({clicked: 'sukienka'});
            if(window.innerWidth > 768) {document.getElementById("price-list-container").style.backgroundImage= "url('./sukienka.jpg')"}
            else {document.getElementById("price-list-container").style.backgroundImage="none"};
            break;
            case 'plaszcz':
            this.setState({clicked: 'plaszcz'});
            if(window.innerWidth > 768) {document.getElementById("price-list-container").style.backgroundImage= "url('./plaszcz.jpg')"}
            else {document.getElementById("price-list-container").style.backgroundImage="none"};
            break;
            case 'koszula':
            this.setState({clicked: 'koszula'});
            if(window.innerWidth > 768) {document.getElementById("price-list-container").style.backgroundImage= "url('./koszula.jpg')"}
            else {document.getElementById("price-list-container").style.backgroundImage="none"};
            break;
            case 'spodnica':
            this.setState({clicked: 'spodnica'});
            if(window.innerWidth > 768) {document.getElementById("price-list-container").style.backgroundImage= "url('./spodnica.jpg')"}
            else {document.getElementById("price-list-container").style.backgroundImage="none"};
            break;
            case 'kurtka':
            this.setState({clicked: 'kurtka'});
            if(window.innerWidth > 768) {document.getElementById("price-list-container").style.backgroundImage= "url('./kurtka.jpg')"}
            else {document.getElementById("price-list-container").style.backgroundImage="none"};
            break;
            case 'inne':
            this.setState({clicked: 'inne'}); 
            if(window.innerWidth > 768) {document.getElementById("price-list-container").style.backgroundImage= "url('./inne.jpg')"}
            else {document.getElementById("price-list-container").style.backgroundImage="none"};
            break;
        }
        
    }
    render() {
        const spodnie = (
            <div className="price-list-item">
                <h5>SPODNIE:</h5>
                <ul>
                <li className="price-item">Skracanie: 20zł</li>
                <li className="price-item">Podwijanie: 20zł</li>
                <li className="price-item">Obcinanie: 20zł</li>
                </ul>
            </div>
        )
        const plaszcz = (
            <div className="price-list-item">
                <h5>PŁASZCZ/MARYNARKA:</h5>
                <ul>
                <li className="price-item">Skracanie: 25zł</li>
                <li className="price-item">Podwijanie: 25zł</li>
                <li className="price-item">Obcinanie: 25zł</li>
                </ul>
            </div>
        )
        const koszula = (
            <div className="price-list-item">
                <h5>KOSZULA:</h5>
                <ul>
                <li className="price-item">Skracanie: 30zł</li>
                <li className="price-item">Podwijanie: 30zł</li>
                <li className="price-item">Obcinanie: 30zł</li>
                </ul>
            </div>
        )
        const sukienka = (
            <div className="price-list-item">
                <h5>SUKIENKA:</h5>
                <ul>
                <li className="price-item">Skracanie: 40zł</li>
                <li className="price-item">Podwijanie: 40zł</li>
                <li className="price-item">Obcinanie: 40zł</li>
                </ul>
            </div>
        )
        const spodnica = (
            <div className="price-list-item">
                <h5>SPÓDNICA:</h5>
                <ul>
                <li className="price-item">Skracanie: 50zł</li>
                <li className="price-item">Podwijanie: 50zł</li>
                <li className="price-item">Obcinanie: 50zł</li>
                </ul>
            </div>
        )
        const kurtka = (
            <div className="price-list-item">
                <h5>KURTKA:</h5>
                <ul>
                <li className="price-item">Skracanie: 75zł</li>
                <li className="price-item">Podwijanie: 75zł</li>
                <li className="price-item">Obcinanie: 75zł</li>
                </ul>
            </div>
        )
        const inne = (
            <div className="price-list-item">
                <h5>INNE USŁUGI:</h5>
                <ul>
                <li className="price-item">Skracanie: 100zł</li>
                <li className="price-item">Podwijanie: 100zł</li>
                <li className="price-item">Obcinanie: 100zł</li>
                </ul>
            </div>
        )
        return(
            <div>
                <Header/>
                <div className="price-list-overall">
                        <div className="price-list-logo">CENNIK</div>
                        <div className="price-list-container" id="price-list-container">
                            <div className="price-list-buttons">
                                <div><button className="price-list-button button" id="spodnie" onClick={this.handlePriceButtonClick}>SPODNIE</button></div>
                                <div><button className="price-list-button button" id="plaszcz" onClick={this.handlePriceButtonClick}>PŁASZCZ/   MARYNARKA</button></div>
                                <div><button className="price-list-button button" id="koszula" onClick={this.handlePriceButtonClick}>KOSZULA</button></div>
                                <div><button className="price-list-button button" id="sukienka" onClick={this.handlePriceButtonClick}>SUKIENKA</button></div>
                                <div><button className="price-list-button button" id="spodnica" onClick={this.handlePriceButtonClick}>SPÓDNICA</button></div>
                                <div><button className="price-list-button button" id="kurtka" onClick={this.handlePriceButtonClick}>KURTKA</button></div>
                                <div><button className="price-list-button button" id="inne" onClick={this.handlePriceButtonClick}>INNE</button></div>
                            </div>
                            <select className="price-list-options button">
                                <option className="price-list-option" id="spodnie" onClick={this.handlePriceButtonClick}>SPODNIE</option>
                                <option className="price-list-option" id="plaszcz" onClick={this.handlePriceButtonClick}>PŁASZCZ/MARYNARKA</option>
                                <option className="price-list-option" id="koszula" onClick={this.handlePriceButtonClick}>KOSZULA</option>
                                <option className="price-list-option" id="sukienka" onClick={this.handlePriceButtonClick}>SUKIENKA</option>
                                <option className="price-list-option" id="spodnica" onClick={this.handlePriceButtonClick}>SPÓDNICA</option>
                                <option className="price-list-option" id="kurtka" onClick={this.handlePriceButtonClick}>KURTKA</option>
                                <option className="price-list-option" id="inne" onClick={this.handlePriceButtonClick}>INNE</option>
                            </select>
                            {this.state.clicked==='spodnie' ? spodnie : null}
                            {this.state.clicked==='plaszcz' ? plaszcz : null}
                            {this.state.clicked==='koszula' ? koszula : null}
                            {this.state.clicked==='sukienka' ? sukienka : null}
                            {this.state.clicked==='spodnica' ? spodnica : null}
                            {this.state.clicked==='kurtka' ? kurtka : null}
                            {this.state.clicked==='inne' ? inne : null}
                         </div> 
                    </div>
                <Footer/>
            </div>
        )
    }
}

export default PriceList