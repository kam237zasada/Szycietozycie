import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ShopHeader from './ShopHeader';
import Footer from './Footer';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ShopHomePage from './ShopHomePage';
import CategoryView from './CategoryView';
import QueryView from './QueryView';
import ProductView from './ProductView';
import BasketView from './BasketView';

class Shop extends React.Component {

    render() {
        return(
            <div>
                <ShopHeader/>
                    <Router>
                        <Switch>
                            <div className="shop-container">
                            <Route path="/sklep" exact component={ShopHomePage}/>
                            <Route path="/sklep/c/:categoryname/:id" exact component={CategoryView}/>
                            <Route path="/sklep/q/szukaj/query=:query" exact component={QueryView}/>
                            <Route path="/sklep/login" exact component={LoginPage}/>
                            <Route path="/sklep/rejestracja" exact component={RegisterPage}/>
                            <Route path="/sklep/p/:productname/:id" exact component={ProductView}/>
                            <Route path="/sklep/b/basket" exact component={BasketView}/>
                            </div>
                        </Switch>
                    </Router>
                <Footer/>
            </div>
        )
    }
}

export default Shop