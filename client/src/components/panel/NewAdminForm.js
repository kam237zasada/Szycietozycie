import React from 'react';
import { connect } from 'react-redux';
import { addAdmin } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../../js/index';

class NewAdminForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            adminPassword: '',
            isAdded: false,
            error: ''
       }
    }

    handleChange = event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
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
            case 'adminPassword':
                this.setState({ adminPassword: event.target.value });
                break;
            default:
                break;
        }
    };


    handleSubmit = async (e) => {
        e.preventDefault();
        const jwt = getCookie("jwt");
        try {
            const {name, email, password, confirmPassword, adminPassword} = this.state;

        await this.props.addAdmin(email, name, password, confirmPassword, adminPassword, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data})
            
            
        }
    
    }

    render() {
        const renderForm = (
            <div className="ui form">
                <form id="addAdmin">
                    <label>Dodaj administratora:</label>
                    <div className="panel-form-container"><div className="panel-form-header">Dane podstawowe:</div>
                    <div className="field">
                        <label>Imię i nazwisko</label>
                        <input
                        type="text"
                        name="name"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Adres email</label>
                        <input
                        type="email"
                        name="email"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Podaj hasło dla nowego administraora</label>
                        <input
                        type="password"
                        name="password"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Powtórz hasło dla nowego administratora</label>
                        <input
                        type="password"
                        name="confirmPassword"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Podaj SWOJE hasło do autoryzacji</label>
                        <input
                        type="password"
                        name="adminPassword"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <label className="error-message">{this.state.error}</label>
                    <button className="panel-button" form="addAdmin" onClick={this.handleSubmit}>Dodaj</button>
                </form>
            </div>
        )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/admins"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { admin: state.admin };

};

export default connect(
    mapStateToProps,
    { addAdmin }
    )(NewAdminForm);