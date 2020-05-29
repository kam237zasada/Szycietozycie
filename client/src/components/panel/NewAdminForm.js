import React from 'react';
import { connect } from 'react-redux';
import { addAdmin } from '../../actions';
import { Redirect } from 'react-router-dom';

class NewAdminForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            isAdded: false
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
            default:
                break;
        }
    };


    handleSubmit = async (e) => {
        e.preventDefault();
        const {name, email, password, confirmPassword} = this.state;
        await this.props.addAdmin(email, name, password, confirmPassword);
        this.setState({isAdded: true});
    
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
                        <label>Podaj hasło</label>
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
                    </div>
                    <button className="panel-button" form="addAdmin" onClick={this.handleSubmit}>Dodaj</button>
                </form>
            </div>
        )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/administratorzy"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { admin: state.admin };

};

export default connect(
    mapStateToProps,
    { addAdmin }
    )(NewAdminForm);