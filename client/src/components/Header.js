import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Basket from './Basket';
import Profile from './Profile'
import { getCookie, countProducts } from '../js/index'
import { connect } from 'react-redux';
import { getCustomer, getBasket, customerLogout} from '../actions';
import { serverbaseURL, baseURL } from '../api/index'

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {dropdown: false, search: ''}
    }

handleClickDropdown = async e => {
    e.preventDefault();
    if(!this.state.dropdown) {
        this.setState({dropdown: true})
    }
    else { this.setState({dropdown: false})}
}

handleChange = event => {
    switch (event.target.name) {
        case 'search':
            this.setState({ search: event.target.value });
            break;
    }
}

handleQuery = e => {
    e.preventDefault();
    window.location.replace(`${baseURL}/sklep/q/szukaj/query=${this.state.search}`);
}

componentDidMount = async () => {
    const customerid = getCookie('customerId');
    const jwt = getCookie('jwt');

    try {
        await this.props.getCustomer(customerid, jwt);
        if(!this.props.customer.login) { 
            await this.props.customerLogout()
        } else {
            this.setState({isLogged: true})}

        } catch (err) {

        }

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


    render() {

        const dropdownmenu = (
            <div className="dropdown-menu">
                <a href="/o-mnie"><div className="dropdown-item">O MNIE</div></a>
                <a href="/sklep"><div className="dropdown-item">SKLEP</div></a>
                <a href="/cennik"><div className="dropdown-item">PRACOWNIA KRAWIECKA</div></a>
                <a href="/kontakt"><div className="dropdown-item">KONTAKT</div></a>
            </div>
        )
        return (
        
            <div className="header"><div className="header-container">
                <div className="header-logo"><a href="/"><img className="logo-image" src={`${serverbaseURL}/product/uploads/logo.png`}></img></a></div>
                <a href="/o-mnie"><div className="header-item">O MNIE</div></a>
                <a href="/sklep"><div className="header-item">SKLEP</div></a>
                <a href="/cennik"><div className="header-item">PRACOWNIA KRAWIECKA</div></a>
                <a href="/kontakt"><div className="header-item">KONTAKT</div></a>
                <div className="search-input">
                    <form>
                        <div className="ui input icon" style={{width: "130px"}}>
                    <input 
                    type="text" 
                    name="search"
                    placeholder="Szukaj..."
                    value={this.state.search}
                    onChange={this.handleChange}/>
                    <button className="search-button" onClick={this.handleQuery}><i className="search icon"></i></button>
                    </div>
                    </form>
                    </div>
                    <Basket products={this.state.amount}/>
                <Profile customer={this.props.customer}/>
            </div>
            <div className="header-small">
            <div className="header-logo header-small-item"><a  href="/"><img className="logo-image" src={`${serverbaseURL}/product/uploads/logo.png`}></img></a></div>
            <button className="header-small-item unfold-button" onClick={this.handleClickDropdown}>MENU <FontAwesomeIcon className="arrow-icon" icon={faSortDown}/></button>
            </div>
            
            <div className="header-container-small">
            <div className="header-logo header-small-item"><a  href="/"><img className="logo-image" src="./logo.png"></img></a></div>
            <button className="header-item unfold-button" onClick={this.handleClickDropdown}><i className="fas fa-bars"></i> MENU</button>
            <div className="search-input">
                    <form>
                        <div className="ui input icon" style={{width: "130px"}}>
                    <input 
                    type="text" 
                    name="search"
                    placeholder="Szukaj..."
                    value={this.state.search}
                    onChange={this.handleChange}/>
                    <button className="search-button" onClick={this.handleQuery}><i className="search icon"></i></button>
                    </div>
                    </form>
                    </div>
                    <Basket products={this.state.amount}/>
                <Profile customer={this.props.customer}/>
            </div>
            
            <div>{this.state.dropdown ? dropdownmenu : null}</div>

            </div>
            
        )
    }
}
const mapStateToProps = state => {
    return { customer: state.customer, basket: state.basket };
};
export default connect(
    mapStateToProps,
    { getCustomer, getBasket, customerLogout }
)(Header);