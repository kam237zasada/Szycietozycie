import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ShopHeader from './ShopHeader';
import Footer from './Footer';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ShopHomePage from './ShopHomePage';
import ProductView from './ProductView';
import BasketView from './BasketView';
import OrderSummary from './OrderSummary';
import MyAccount from './MyAccount';
import MyOrders from './MyOrders';
import PasswordReminder from './PasswordReminder'
import NewPassword from './NewPassword'
import Header from './Header'
import Site from './Site';
import SingleOrder from './SingleOrder';

class Shop extends React.Component {

    componentDidMount = () => {
        let head = document.getElementsByTagName("head");
        let title = document.getElementsByTagName("title");
        title[0].innerHTML = "Modne torebki skórzane | Torebki handmade | sklep internetowy";
        let description = document.createElement("meta");
        description.setAttribute("name", "description");
        description.setAttribute("content", "Sklep internetowy z torebkami, sam wybierasz wzór! Idealne na prezent. Modne torebki damskie oraz organizery na torebki, nerki, workoplecaki! ");
        head[0].appendChild(description)
    }

    render() {
        return(
            <div>
                                                <Header/>
                    <Router>
                        <Switch>
                            <div className="shop-container">
                            <Route path="/sklep" exact component={ShopHomePage}/>
                            <Route path="/sklep/page/:pageNumber" exact component={ShopHomePage}/>
                            <Route path="/sklep/sort=:sort" exact component={ShopHomePage}/>
                            <Route path="/sklep/sort=:sort/page/:pageNumber" exact component={ShopHomePage}/>
                            <Route path="/sklep/pricefrom=:priceA/priceto=:priceB" exact component={ShopHomePage}/>
                            <Route path="/sklep/pricefrom=:priceA/priceto=:priceB/page/:pageNumber" exact component={ShopHomePage}/>
                            <Route path="/sklep/pricefrom=:priceA/priceto=:priceB/sort=:sort" exact component={ShopHomePage}/>
                            <Route path="/sklep/pricefrom=:priceA/priceto=:priceB/sort=:sort/page/:pageNumber" exact component={ShopHomePage}/>

                            <Route path="/sklep/c/:categoryname/:categoryId" exact component={ShopHomePage}/>
                            <Route path="/sklep/c/:categoryname/:categoryId/page/:pageNumber" exact component={ShopHomePage}/>
                            <Route path="/sklep/c/:categoryname/:categoryId/sort=:sort" exact component={ShopHomePage}/>
                            <Route path="/sklep/c/:categoryname/:categoryId/sort=:sort/page/:pageNumber" exact component={ShopHomePage}/>
                            <Route path="/sklep/c/:categoryname/:categoryId/pricefrom=:priceA/priceto=:priceB" exact component={ShopHomePage}/>
                            <Route path="/sklep/c/:categoryname/:categoryId/pricefrom=:priceA/priceto=:priceB/page/:pageNumber" exact component={ShopHomePage}/>
                            <Route path="/sklep/c/:categoryname/:categoryId/pricefrom=:priceA/priceto=:priceB/sort=:sort" exact component={ShopHomePage}/>
                            <Route path="/sklep/c/:categoryname/:categoryId/pricefrom=:priceA/priceto=:priceB/sort=:sort/page/:pageNumber" exact component={ShopHomePage}/>
                            
                            <Route path="/sklep/q/szukaj/query=:query" exact component={ShopHomePage}/>
                            <Route path="/sklep/q/szukaj/query=:query/page/:pageNumber" exact component={ShopHomePage}/>
                            <Route path="/sklep/q/szukaj/query=:query/sort=:sort" exact component={ShopHomePage}/>
                            <Route path="/sklep/q/szukaj/query=:query/sort=:sort/page/:pageNumber" exact component={ShopHomePage}/>
                            <Route path="/sklep/q/szukaj/query=:query/pricefrom=:priceA/priceto=:priceB" exact component={ShopHomePage}/>
                            <Route path="/sklep/q/szukaj/query=:query/pricefrom=:priceA/priceto=:priceB/page/:pageNumber" exact component={ShopHomePage}/>
                            <Route path="/sklep/q/szukaj/query=:query/pricefrom=:priceA/priceto=:priceB/sort=:sort" exact component={ShopHomePage}/>
                            <Route path="/sklep/q/szukaj/query=:query/pricefrom=:priceA/priceto=:priceB/sort=:sort/page/:pageNumber" exact component={ShopHomePage}/>
                            
                            <Route path="/sklep/login" exact component={LoginPage}/>
                            <Route path="/sklep/rejestracja" exact component={RegisterPage}/>
                            <Route path="/sklep/p/:productname/:id" exact component={ProductView}/>
                            <Route path="/sklep/b/basket" exact component={BasketView}/>
                            <Route path="/sklep/o/order_summary" exact component={OrderSummary}/>
                            <Route path="/sklep/my_account" exact component={MyAccount}/>
                            <Route path="/sklep/my_orders" exact component={MyOrders}/>
                            <Route path="/sklep/przypomnij_haslo" exact component={PasswordReminder}/>
                            <Route path="/sklep/password/new/customer/:id/:token" exact component={NewPassword}/>
                            <Route path="/sklep/s/:sitename/:id" exact component={Site}/>
                            <Route path="/sklep/order/single-order/:accessToken" exact component={SingleOrder}/>

                            </div>
                        </Switch>
                    </Router>

                <Footer/>
                <ShopHeader/>
            </div>
        )
    }
}

export default Shop