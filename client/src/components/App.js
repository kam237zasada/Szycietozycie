import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import './panel.css';
import LandingPage from './LandingPage';
import AboutMe from './AboutMe';
import Shop from './Shop';
import PriceList from './PriceList';
import Contact from './Contact';
import AdminLoginPage from './panel/AdminLoginPage';
import AdminHomePage from './panel/AdminHomePage';
import CookieConsent from "react-cookie-consent";


const App = () => {
    return (
        <>
        <CookieConsent
                  buttonText="Akceptuję"
                  hideOnAccept={true}
                  expires={1}>Ta strona wykorzystuje pliki cookies do swojego działania, przeglądając stronę, zgadzasz się na ich używanie. Więcej informacji w Polityce prywatności.</CookieConsent>
        <Router>
            <Switch>
               <Route path="/" exact component={LandingPage}/>
               <Route path="/o-mnie" exact component={AboutMe}/>
               <Route path="/sklep/*" exact component={Shop}/>
               <Route path="/sklep" exact component={Shop}/>
               <Route path="/cennik" exact component={PriceList}/>
               <Route path="/kontakt" exact component={Contact}/>
               <Route path="/admin/" exact component={AdminLoginPage}/>
               <Route path="/admin/*" exact component={AdminHomePage}/>
            </Switch>
        </Router>
        </>
    )
}

export default App;
