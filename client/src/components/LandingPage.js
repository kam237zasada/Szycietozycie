import React from 'react';
import Header from './Header';
import Footer from './Footer';

class LandingPage extends React.Component {

    render() {
        return(
            <div>
                <Header/>
                <div classNAme="landing-overall">
                <div className="landing-container">
                    <div className="landing-item">
                        <img className="landing-item-image" src="./uslugi.jpg"/>
                        <h2 className="landing-item-header">Usługi krawieckie</h2>
                        <p className="landing-item-content">Od ponad 20 lat świadczę szerokopojęte usługi krawieckie. Zwężanie nogawek, rękawów, skracanie spodni, koszul, sukienek. Zawsze dokładnie słucham klienta oraz jestem w stanie fachowo doradzić. Sprawdź ceny w <a href="/cennik" style={{color: "blue"}}>cenniku</a>.</p>
                    </div>
                    <div className="landing-item">
                        <img className="landing-item-image" src="./pasmanteria.jpg"/>
                        <h2 className="landing-item-header">Pasmanteria</h2>
                        <p className="landing-item-content">Posiadam szeroki asortyment akcesoriów krawieckich. Guziki, nici, igły, zamki. Każdy znajdzie u mnie coś dobrego.</p>
                    </div>
                    <div className="landing-item">
                        <img className="landing-item-image" src="./galanteria.jpg"/>
                        <h2 className="landing-item-header">Galanteria skórzana</h2>
                        <p className="landing-item-content">W asortymencie znajdziecie również wysokiej jakości galanterię skórzaną. Paski, portfele z prawdziwej skóry i nie tylko!</p>
                    </div>
                    <div className="landing-item">
                        <img className="landing-item-image" src="./sklep.jpg"/>
                        <h2 className="landing-item-header">Sklep</h2>
                        <p className="landing-item-content">Na mojej stronie znajdziesz również produkty do kupienia. Produkty, które sama szyję! Torebki z ekoskóry i nie tylko, same oryginalne wzory. <a href="/sklep" style={{color: "blue"}}>Zobacz więcej!</a></p>
                    </div>
                </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default LandingPage;