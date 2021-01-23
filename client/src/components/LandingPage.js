import React from 'react';
import Header from './Header';
import Footer from './Footer';

class LandingPage extends React.Component {


    render() {
        return(
            <div>
                <Header/>
                <div className="landing-overall">
                <div className="landing-container">
                    <div className="landing-item">
                        <img className="landing-item-image" src="./uslugi.jpg" alt="usługi-krawieckie"/>
                        <h2 className="landing-item-header">Pracownia krawieckia</h2>
                        <p className="landing-item-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fermentum eros vel hendrerit volutpat. Nam sit amet massa ornare, sodales turpis non, accumsan felis. In sit amet dui magna. In tristique diam quis ligula dignissim scelerisque. Duis sed mi vitae tortor feugiat lacinia. In ut mi viverra, iaculis libero at, vestibulum neque. Pellentesque quam purus, efficitur vel congue at, blandit eu risus. Sprawdź ceny w <a href="/cennik" style={{color: "blue"}}>cenniku</a>.</p>
                    </div>
                    <div className="landing-item">
                        <img className="landing-item-image" src="./pasmanteria.jpg" alt="pasmanteria"/>
                        <h2 className="landing-item-header">Pasmanteria</h2>
                        <p className="landing-item-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fermentum eros vel hendrerit volutpat. Nam sit amet massa ornare, sodales turpis non, accumsan felis. In sit amet dui magna. In tristique diam quis ligula dignissim scelerisque. Duis sed mi vitae tortor feugiat lacinia. In ut mi viverra, iaculis libero at, vestibulum neque. Pellentesque quam purus, efficitur vel congue at, blandit eu risus. </p>
                    </div>
                    <div className="landing-item">
                        <img className="landing-item-image" src="./galanteria.jpg" alt="galanteria"/>
                        <h2 className="landing-item-header">Galanteria skórzana</h2>
                        <p className="landing-item-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fermentum eros vel hendrerit volutpat. Nam sit amet massa ornare, sodales turpis non, accumsan felis. In sit amet dui magna. In tristique diam quis ligula dignissim scelerisque. Duis sed mi vitae tortor feugiat lacinia. In ut mi viverra, iaculis libero at, vestibulum neque. Pellentesque quam purus, efficitur vel congue at, blandit eu risus. </p>
                    </div>
                    <div className="landing-item">
                        <img className="landing-item-image" src="./sklep.jpg" alt="sklep-internetowy"/>
                        <h2 className="landing-item-header">Sklep</h2>
                        <p className="landing-item-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fermentum eros vel hendrerit volutpat. Nam sit amet massa ornare, sodales turpis non, accumsan felis. In sit amet dui magna. In tristique diam quis ligula dignissim scelerisque. Duis sed mi vitae tortor feugiat lacinia. In ut mi viverra, iaculis libero at, vestibulum neque. Pellentesque quam purus, efficitur vel congue at, blandit eu risus. <a href="/sklep" style={{color: "blue"}}>Zobacz więcej!</a></p>
                    </div>
                </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default LandingPage;