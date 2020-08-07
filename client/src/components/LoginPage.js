import React from 'react';
import { connect } from 'react-redux';
import { customerLogin } from '../actions';
import { Redirect } from 'react-router-dom';
import ShopMenu from './ShopMenu';
import { baseURL } from '../api/index'

class LoginPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            login: '',
            password: '',
            isLogged: false
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        try {
        const { login, password } = this.state;
        await this.props.customerLogin(login, password);
        this.setState({isLogged: true}); }
        catch (err) {
            this.setState({error: err.response.data})
        }
    }
    handleChange = event => {
        switch (event.target.name) {
            case 'login':
                this.setState({ login: event.target.value });
                break;
            case 'password':
                this.setState({ password: event.target.value });
                break;
            default:
                break;
        }
    };
    

    render() {

        const renderform = (
            <div className="ui form customer-form">
                <form id="customerLogin">
                    <div className="customer-form-container"><div className="shop-form-header">Zaloguj się:</div>
                    <div className="field">
                        <label>Login</label>
                        <input
                        type="text"
                        name="login"
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
                    <button className="button-basket" form="customerLogin" onClick={this.handleSubmit}>Zaloguj się</button>
                    {this.state.error}
                    </div>
                </form>
                <p>Nie pamiętasz hasła?</p>
                <a href={`${baseURL}/sklep/przypomnij_haslo`}><button className="button-basket">Przypomnij hasło</button></a>
                <p>Nie masz konta?</p>
                <a href={`${baseURL}/sklep/rejestracja`}><button className="button-basket">Dołącz teraz</button></a>
                
            </div>
        )
        return(
            <div className="shop-content"><ShopMenu/>
                   {this.state.isLogged ? <Redirect push to="/sklep"/> : renderform}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { customer: state.customer };

};

export default connect(
    mapStateToProps,
    { customerLogin }
    )(LoginPage);