import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import LandingPage from './LandingPage';
import AboutMe from './AboutMe';
import Shop from './Shop';
import PriceList from './PriceList';
import Contact from './Contact';

const App = () => {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
               <Route path="/" exact component={LandingPage}/>
               <Route path="/o-mnie" exact component={AboutMe}/>
               <Route path="/sklep" exact component={Shop}/>
               <Route path="/cennik" exact component={PriceList}/>
               <Route path="/kontakt" exact component={Contact}/>
            </Switch>
        </Router>
    )
}

export default App;
