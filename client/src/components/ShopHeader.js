import React from 'react';
import { getCustomer, getBasket} from '../actions';
import { connect } from 'react-redux';
import Basket from './Basket';
import Profile from './Profile';
import { getCookie, countProducts } from '../js/index';
import {baseURL} from '../api/index';
import { getCategories } from '../actions';
import { changeString } from '../js/index';




class ShopHeader extends React.Component {
    constructor(props){
        super(props)
        this.state= { id: '', search: '', dropdown: false, isLogged: false, showMenu: false, loaded: false, showQuery:false }
    }

    componentDidMount = async () => {
        const customerid = getCookie('customerId');
        const jwt = getCookie('jwt')

        try {
            await this.props.getCustomer(customerid, jwt);
            if(!this.props.customer.login) { 
                await this.props.customerLogout()
            } else {
                this.setState({isLogged: true})}
    
            } catch (err) {
                
            }
            await this.props.getCategories()
            this.setState({loaded: true})

            let basketId = getCookie("basketId");
            if(!basketId) {             
                return
            } 
            await this.props.getBasket(basketId);
            const sum = countProducts(this.props.basket.products);
            this.setState({amount: sum});
            let redDot = document.getElementsByClassName("basket-items");
            
                redDot = Array.from(redDot);
                redDot.map(element => {
                    return element.style.display="block";
                })


            
    } 

    handleChange = event => {
        switch (event.target.name) {
            case 'search':
                console.log(event.target.value)
                this.setState({ search: event.target.value });
                break;
                default:
                    break;
        }
    }
     
    
    dropdownButton = async e => {
        e.preventDefault();
        if(!this.state.dropdown) {
            this.setState({dropdown: true})
        }
        else { this.setState({dropdown: false})}
    }

    handleShowQuery = () => {
        if(!this.state.showQuery) {
            this.setState({showQuery: true})
            this.setState({showMenu: false})
        } else { this.setState({showQuery: false})}
    }

    handleQuery = e => {
        e.preventDefault();
        window.location.replace(`${baseURL}/sklep/q/szukaj/query=${this.state.search}`);
    }

    handleClickMenu = e => {
        if(!this.state.showMenu) {
            this.setState({showMenu: true})
            this.setState({showQuery: false})
        } else { this.setState({showMenu: false})}
    }

    renderCategories = () => {
        return this.props.categories.map(category => {
            let newString = changeString(category.name);

            return <div className="mobile-category-item"><a href={`/sklep/c/${newString}/${category.ID}`}>{category.name}</a></div>
        })
    }
    render() {


        const contentIfLogged = (
            <div className="shop-dropdown-menu">
            <a href="/sklep/moje-konto"><div className="shop-dropdown-item">Moje konto</div></a>
            <a><div className="shop-dropdown-item">Wyloguj się</div></a>
            </div>
        )

        const contentIfNotLogged = (
            <div className="shop-dropdown-menu">
                <a href="/sklep/login"><div className="shop-dropdown-item">Zaloguj się</div></a>
                <a href="/sklep/rejestracja"><div className="shop-dropdown-item">Rejestracja</div></a>
            </div>
        )
        const dropdownmenu = (
            <div>
                {this.state.isLogged ? contentIfLogged : contentIfNotLogged}
            </div>
        )

        const showMenu = (
            <div className="mobile-category-list">{this.renderCategories()}</div>
        )

        const showQuery = (
            <div style={{zIndex:2}} className="search-input">
                    <form>
                        <div className="ui input icon" style={{width: "100%"}}>
                    <input 
                    className="search-input-mobile"
                    type="text" 
                    name="search"
                    placeholder="Szukaj..."
                    value={this.state.search}
                    onChange={this.handleChange}/>
                    <button className="search-button" onClick={this.handleQuery}><i className="search icon"></i></button>
                    </div>
                    </form>
                    </div>
        )

        const isLoaded = (
            <>{this.state.showMenu ? showMenu : null}
            {this.state.showQuery ? showQuery : null}
            <div className="shop-header-container">
                <button onClick={this.handleClickMenu} className="shop-header-menu"><i className="fas fa-bars shop-header-item"></i></button>
                <button onClick={this.handleShowQuery} className="shop-header-menu"><i className="fas fa-search shop-header-item"></i></button>
                <Basket className="shop-header-menu" Basket products={this.state.amount}/>
                <Profile className="shop-header-menu" customer={this.props.customer}/>
            </div>
            
            <div>{this.state.dropdown ? dropdownmenu : null}</div></>
        )
        return (
        <>{this.state.loaded ? isLoaded : <div>Wczytywanie strony...</div>}</>
        )
    }
}
const mapStateToProps = state => {
    return { customer: state.customer, basket: state.basket, categories: state.categories };
};
export default connect(
    mapStateToProps,
    { getCustomer, getBasket, getCategories }
)(ShopHeader);