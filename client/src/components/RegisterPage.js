import React from 'react';
import { connect } from 'react-redux';
import { addCustomer } from '../actions';
import { Redirect } from 'react-router-dom';

class RegisterPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            login: '',
            email: '',
            password: '',
            confirmPassword: '',
            isRegistered: false
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        const { login, email, password, confirmPassword } = this.state;
        await this.props.addCustomer(login, email, password, confirmPassword);
        this.setState({isRegistered: true});
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
            default:
                break;
        }
    };

    render() {

        const renderform = (
            <div className="customer-form">
                <form id="customerRegister">
                    <div className="customer-form-container"><div className="customer-form-header">Zarejestruj się:</div>
                    <div className="customer-form-field">
                        <label>Login</label>
                        <input
                        type="text"
                        name="login"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="customer-form-field">
                        <label>Email</label>
                        <input
                        type="email"
                        name="email"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="customer-form-field">
                        <label>Hasło</label>
                        <input
                        type="password"
                        name="password"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="customer-form-field">
                        <label>Powtórz hasło</label>
                        <input
                        type="password"
                        name="confirmPassword"
                        onChange={this.handleChange}
                        required></input>
                    </div> 
                    <button className="button" form="customerRegister" onClick={this.handleSubmit}>Zarejestruj!</button>               
                    </div>
                    
                </form>
            </div>
        )
        return(
                <div>{this.state.isRegistered ? <Redirect push to="/sklep"/> : renderform}</div>
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