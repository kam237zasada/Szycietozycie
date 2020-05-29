import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome, faUserCircle, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { getCustomer} from '../actions';
import { connect } from 'react-redux';
import Basket from './Basket';
import Profile from './Profile';


class ShopHeader extends React.Component {
    constructor(props){
        super(props)
        this.state= { id: '', search: '', dropdown: false, isLogged: false }
    }
    componentDidMount = async () => {
        const customerid = localStorage.getItem('customerid');
        if (customerid) { await this.props.getCustomer(customerid);
            this.setState({isLogged: true})}
    } 

    handleChange = event => {
        switch (event.target.name) {
            case 'search':
                console.log(event.target.value)
                this.setState({ search: event.target.value });
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
        return (
            <div className="header">
                <div className="shop-header-container">
                <div className="header-logo shop-header-item"><a href="/"><FontAwesomeIcon icon={faHome}/></a></div>
                <div className="ui icon input">
                    <input 
                    type="text" 
                    name="search"
                    placeholder="Szukaj..."
                    onChange={this.handleChange}/>
                    <a className="search-button" href={`/sklep/q/szukaj/query=${this.state.search}`}><i className="search icon"></i></a>
                </div>
                <Basket/>
                <Profile customer={this.props.customer}/>
            </div>
            <div>{this.state.dropdown ? dropdownmenu: null}</div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return { customer: state.customer };
};
export default connect(
    mapStateToProps,
    { getCustomer }
)(ShopHeader);