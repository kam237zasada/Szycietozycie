import React from 'react';
import { connect } from 'react-redux';
import { customerLogin } from '../actions';
import { Redirect } from 'react-router-dom';

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
        const { login, password } = this.state;
        await this.props.customerLogin(login, password);
        this.setState({isLogged: true});
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
            <div className="customer-form">
                <form id="customerLogin">
                    <div className="customer-form-container"><div className="customer-form-header">Zaloguj się:</div>
                    <div className="customer-form-field">
                        <label>Login</label>
                        <input
                        type="text"
                        name="login"
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
                    <button className="button" form="customerLogin" onClick={this.handleSubmit}>Zaloguj!</button>

                    </div>
                </form>
            </div>
        )
        return(
               <div>{this.state.isLogged ? <Redirect push to="/sklep"/> : renderform}</div>
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