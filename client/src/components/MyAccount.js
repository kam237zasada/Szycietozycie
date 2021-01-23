import React from 'react'
import { connect } from 'react-redux';
import { getCustomer, updateData, updateInvoice, updateCustomer, updateCustomerPassword } from '../actions/index';
import { getCookie } from '../js/index';
import ShopMenu from './ShopMenu';

class MyAccount extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            log: '',
            login: '',
            email:'',
            name: '',
            telephone: '',
            street: '',
            zipCode: '',
            city: '',
            companyName: '',
            companyStreet: '',
            companyzipCode: '',
            companyCity: '',
            companyNIP: '',
            customerIdentities: {},
            companyIdentities: {},
            helloMessage: ''
        }
    }

    componentDidMount = async () => {
        let customerId = getCookie("customerId");
        let jwt = getCookie("jwt");
        if(!customerId) {
            this.setState({log: "musisz się najpierw zalogować"})
        }
        await this.props.getCustomer(customerId, jwt);
        this.setState({login: this.props.customer.login})
        this.setState({helloMessage: this.props.customer.login})
        this.setState({email: this.props.customer.email})
        this.setState({customerIdentities: this.props.customer.customerIdentities})
        this.setState({companyIdentities: this.props.customer.companyIdentities})
    }

    showSuccess = () => {
        let root = document.getElementById("root");
        let mask = document.createElement("div");
        mask.setAttribute("id", "mask");
        root.after(mask);
        let message = document.createElement("div");
        message.setAttribute("class", "question-response")
        message.innerText = this.props.customer.message;
        mask.after(message);
        setTimeout(function() {
            message.remove();
            mask.remove();
            window.location.reload(true);   
        }, 2000)   
    }

    handleUpdateCustomer = async e => {
        e.preventDefault();
        let jwt = getCookie("jwt");
        try {
            await this.props.updateCustomer(this.props.customer._id, this.state.login, this.state.email, jwt);
            this.showSuccess();
        } catch (err) {
            this.setState({firstError: err.response.data})
        }

    }

    handleUpdatePassword = async e => {
        e.preventDefault();
        let jwt = getCookie("jwt");
        try {
            await this.props.updateCustomerPassword(this.props.customer._id, this.state.currentPassword, this.state.password, this.state.confirmPassword, jwt);
            this.showSuccess();
        } catch (err) {
            this.setState({secondError: err.response.data})
        }
    }

    handleUpdateCustomerIdentities = async e => {
        e.preventDefault();
        let jwt = getCookie("jwt");
        const {name, telephone, street, zipCode, city} = this.state.customerIdentities
        try {
            await this.props.updateData(this.props.customer._id, name, telephone, street, zipCode, city, jwt);
            this.showSuccess();
        } catch (err) {
            this.setState({thirdError: err.response.data})
        }
    }

    handleUpdateCompanyIdentities = async e => {
        e.preventDefault();
        let jwt = getCookie("jwt");
        const {companyName, companyStreet, companyZipCode, companyCity, companyNIP} = this.state.companyIdentities
        try {
            await this.props.updateInvoice(this.props.customer._id, companyName, companyStreet, companyZipCode, companyCity, companyNIP, jwt);
            this.showSuccess();
        } catch (err) {
            this.setState({fourthError: err.response.data})
        }
    }

    handleChange = e => {
        let data = e.target.value;
        switch(e.target.name) {
            case 'login':
                this.setState({login: e.target.value});
                console.log(this.state.login)
                break;
            case 'email':
                this.setState({email: e.target.value});
                break;
            case 'currentPassword':
                this.setState({currentPassword: e.target.value});
                break;
            case 'password':
                this.setState({password: e.target.value});
                break;
            case 'confirmPassword':
                this.setState({confirmPassword: e.target.value});
                break;
            case 'name':
                this.setState(prevState => {
                    let customerIdentities = Object.assign({}, prevState.customerIdentities);
                    customerIdentities.name = data;
                    return {customerIdentities}
                })
                break;
            case 'telephone':
                this.setState(prevState => {
                    let customerIdentities = Object.assign({}, prevState.customerIdentities);
                    customerIdentities.telephone = data;
                    return {customerIdentities}
                })
                break;
            case 'street':
                this.setState(prevState => {
                    let customerIdentities = Object.assign({}, prevState.customerIdentities);
                    customerIdentities.street = data;
                    return {customerIdentities}
                })
                break;
            case 'zipCode':
                this.setState(prevState => {
                    let customerIdentities = Object.assign({}, prevState.customerIdentities);
                    customerIdentities.zipCode = data;
                    return {customerIdentities}
                })
                break;
            case 'city':
                this.setState(prevState => {
                    let customerIdentities = Object.assign({}, prevState.customerIdentities);
                    customerIdentities.city = data;
                    return {customerIdentities}
                })
                break;
            case 'companyName':
                this.setState(prevState => {
                    let companyIdentities = Object.assign({}, prevState.companyIdentities);
                    companyIdentities.companyName = data;
                    return {companyIdentities}
                })
                break;
            case 'companyStreet':
                this.setState(prevState => {
                    let companyIdentities = Object.assign({}, prevState.companyIdentities);
                    companyIdentities.companyStreet = data;
                    return {companyIdentities}
                })
                break;
            case 'companyZipCode':
                this.setState(prevState => {
                    let companyIdentities = Object.assign({}, prevState.companyIdentities);
                    companyIdentities.companyZipCode = data;
                    return {companyIdentities}
                })
                break;
            case 'companyCity':
                this.setState(prevState => {
                    let companyIdentities = Object.assign({}, prevState.companyIdentities);
                    companyIdentities.companyCity = data;
                    return {companyIdentities}
                })
                break;
            case 'companyNIP':
                this.setState(prevState => {
                    let companyIdentities = Object.assign({}, prevState.companyIdentities);
                    companyIdentities.companyNIP = data;
                    return {companyIdentities}
                })
                break;
            
        }
    }

    render() {
        return(
            <div className="shop-content"><ShopMenu/>
            <div className="customer-panel-container">
                <h2>Witaj {this.state.helloMessage}, oto Twój panel klienta</h2>
                <div className="customer-panel-form ui form">
                    <form id="updateCustomer">
                <div className="customer-form-container"><div className="customer-form-header">Edytuj dane:</div>
                <div className="field">
                    <label>Login</label>
                    <input
                    type="text"
                    name="login"
                    value={this.state.login}
                    onChange={this.handleChange}
                    required></input>
                </div>
                <div className="field">
                    <label>Email</label>
                    <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required></input>
                </div>
                <span style={{color: 'red'}}>{this.state.firstError}</span>
                <button className="button-basket" form="updateCustomer" onClick={this.handleUpdateCustomer}>Edytuj</button>               
                </div>  
            </form>
        </div>
        <div className="customer-panel-form ui form">
                    <form id="updatePassword">
                <div className="customer-form-container"><div className="customer-form-header">Zmień hasło:</div>
                <div className="field">
                    <label>Podaj aktualne hasło</label>
                    <input
                    type="password"
                    name="currentPassword"
                    onChange={this.handleChange}
                    required></input>
                </div>
                <div className="field">
                    <label>Podaj nowe hasło</label>
                    <input
                    type="password"
                    name="password"
                    onChange={this.handleChange}
                    required></input>
                </div>
                <div className="field">
                    <label>Powtórz nowe hasło</label>
                    <input
                    type="password"
                    name="confirmPassword"
                    onChange={this.handleChange}
                    required></input>
                </div> 
                <span style={{color: 'red'}}>{this.state.secondError}</span>
                <button className="button-basket" form="customerRegister" onClick={this.handleUpdatePassword}>Zmień</button>               
                </div>
            </form>
        </div>
        <div className="customer-panel-form ui form">
                    <form id="customerIdentities">
                <div className="customer-form-container"><div className="customer-form-header">Dane użytkownika:</div>
                <div className="field">
                    <label>Imię nazwisko</label>
                    <input
                    type="text"
                    name="name"
                    value={this.state.customerIdentities.name}
                    onChange={this.handleChange}
                    required></input>
                </div>
                <div className="field">
                    <label>Ulica i numer domu</label>
                    <input
                    type="text"
                    name="street"
                    value={this.state.customerIdentities.street}
                    onChange={this.handleChange}
                    required></input>
                </div>
                <div className="field">
                    <label>Kod pocztowy</label>
                    <input
                    type="text"
                    name="zipCode"
                    value={this.state.customerIdentities.zipCode}
                    onChange={this.handleChange}
                    required></input>
                </div> 
                <div className="field">
                    <label>Miasto</label>
                    <input
                    type="text"
                    name="city"
                    value={this.state.customerIdentities.city}
                    onChange={this.handleChange}
                    required></input>
                </div> 
                <div className="field">
                    <label>Telefon</label>
                    <input
                    type="text"
                    name="telephone"
                    value={this.state.customerIdentities.telephone}
                    onChange={this.handleChange}
                    required></input>
                </div>
                <span style={{color: 'red'}}>{this.state.thirdError}</span>
                <button className="button-basket" form="customerIdentities" onClick={this.handleUpdateCustomerIdentities}>Zapisz</button>               
                </div>  
            </form>
        </div>
        {/* <div className="customer-panel-form ui form">
                    <form id="invoiceIdentities">
                <div className="customer-form-container"><div className="customer-form-header">Dane do faktury:</div>
                <div className="field">
                    <label>Nazwa firmy</label>
                    <input
                    type="text"
                    name="companyName"
                    value={this.state.companyIdentities.companyName}
                    onChange={this.handleChange}
                    required></input>
                </div>
                <div className="field">
                    <label>Ulica i numer domu</label>
                    <input
                    type="text"
                    name="companyStreet"
                    value={this.state.companyIdentities.companyStreet}
                    onChange={this.handleChange}
                    required></input>
                </div>
                <div className="field">
                    <label>Kod pocztowy</label>
                    <input
                    type="text"
                    name="companyZipCode"
                    value={this.state.companyIdentities.companyZipCode}
                    onChange={this.handleChange}
                    required></input>
                </div>
                <div className="field">
                    <label>Miasto</label>
                    <input
                    type="text"
                    name="companyCity"
                    value={this.state.companyIdentities.companyCity}
                    onChange={this.handleChange}
                    required></input>
                </div>
                <div className="field">
                    <label>Numer NIP</label>
                    <input
                    type="text"
                    name="companyNIP"
                    value={this.state.companyIdentities.companyNIP}
                    onChange={this.handleChange}
                    required></input>
                </div> 
                <span style={{color: 'red'}}>{this.state.fourthError}</span>
                <button className="button-basket" form="invoiceIdentities" onClick={this.handleUpdateCompanyIdentities}>Zapisz</button>               
                </div>  
            </form>
        </div> */}
        </div>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { customer: state.customer };
};

export default connect(
    mapStateToProps,
    { getCustomer, updateData, updateInvoice, updateCustomer, updateCustomerPassword }
    )(MyAccount);