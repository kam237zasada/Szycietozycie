import React from 'react';
import { connect } from 'react-redux';
import { addCustomer } from '../actions';
import { Redirect } from 'react-router-dom';
import ShopMenu from './ShopMenu';
import { baseURL } from '../api/index'

class RegisterPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            login: '',
            email: '',
            password: '',
            confirmPassword: '',
            privacyPolicy: false,
            regAccept: false,
            isRegistered: false
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        console.log("abb")
        this.setState({error: ''})
        const { login, email, password, confirmPassword, privacyPolicy, regAccept } = this.state;
        if(!privacyPolicy || !regAccept) {
            return this.setState({error: "Należy zaznaczyć oba pola z gwiazdą by mieć możliwość założenia konta"})
        }
        try {
        await this.props.addCustomer(login, email, password, confirmPassword);
        this.setState({isRegistered: true});
        } catch(err) {
            return this.setState({error: err.response.data})
        }
    }
    handleChange = event => {
        switch (event.target.name) {
            case 'login':
                this.setState({ login: event.target.value });
                break;
            case 'email':
                this.setState({ email: event.target.value });
                break;
            case 'password':
                this.setState({ password: event.target.value });
                break;
            case 'confirmPassword':
                this.setState({ confirmPassword: event.target.value });
                break;
            case 'regAccept':
                if(event.target.checked) {
                this.setState({regAccept: true})
                } else {
                    this.setState({regAccept: false})
                }
                break;
                case 'privacyPolicy':
                if(event.target.checked) {
                    this.setState({privacyPolicy: true})
                    } else {
                        this.setState({privacyPolicy: false})
                    }
                    break;
            default:
                break;
        }
    };

    render() {

        const renderform = (
            <div className="customer-form ui form">
                <form id="customerRegister">
                    <div className="customer-form-container"><div className="customer-form-header">Zarejestruj się:</div>
                    <div className="field">
                        <label>Login</label>
                        <input
                        type="text"
                        name="login"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input
                        type="email"
                        name="email"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Hasło</label>
                        <input
                        type="password"
                        name="password"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Powtórz hasło</label>
                        <input
                        type="password"
                        name="confirmPassword"
                        onChange={this.handleChange}
                        required></input>
                    </div> 
                    <div className='accepts-container'>
            <label><input
                type="checkbox"
                className="checkbox"
                name="regAccept"
                onChange={this.handleChange}
                /> <b>*</b> Oświadczam, że zapoznałem się z Regulaminem sklepu oraz akceptuję jego warunki.</label>
                <label><input
                type="checkbox"
                className="checkbox"
                name="privacyPolicy"
                onChange={this.handleChange}
                /> <b>*</b> Oświadczam, że zapoznałem się z polityką prywatności sklepu "Torebkowa Mania".</label>
                    </div>  
                    <button className="button-basket" form="customerRegister" onClick={this.handleSubmit}>Zarejestruj!</button>   
                    <span style={{color: 'red'}}>{this.state.error}</span>
          
                    </div>
                    
                    
                </form>
                <p>Masz już konto?</p>
                <a href={`${baseURL}/sklep/login`}><button className="button-basket">Zaloguj się</button></a>
            </div>
        )
        return(
            <div className="shop-content"><ShopMenu/>
                    {this.state.isRegistered ? <Redirect push to="/sklep"/> : renderform}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { customer: state.customer };
};

export default connect(
    mapStateToProps,
    { addCustomer }
    )(RegisterPage);