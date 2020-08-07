import React from 'react';
import { connect } from 'react-redux';
import { getAdmin, updateAdmin, updateAdminPassword } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../../js/index';

class UpdateAdminForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            email: '',
            currentPassword: '',
            password: '',
            confirmPassword: '',
            adminPassword: '',
            adminPasswordData: '',
            isUpdated: false,
            errorEdit: '',
            errorPassword:''
        }
    }

    componentDidMount = async () => {
        let id;
        if(this.props.match.params.id) {
            id = this.props.match.params.id
        } else {
            id = getCookie('adminId');

        }
        const jwt = getCookie("jwt");
        await this.props.getAdmin(id, jwt);
        this.setState({_id: this.props.admin._id})
        this.setState({name: this.props.admin.name})
        this.setState({email: this.props.admin.email})

    }

    handleChange = event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            case 'email':
               this.setState({ email: event.target.value });
                break;
            case 'adminPassword':
               this.setState({ adminPassword: event.target.value });
                break;
            case 'adminPasswordData':
               this.setState({ adminPasswordData: event.target.value });
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


    handleUpdate = async (e) => {
        e.preventDefault();
        try {
        const {_id, name, email, adminPasswordData} = this.state;
        const jwt = getCookie("jwt");
        await this.props.updateAdmin(_id, email, name, adminPasswordData, jwt);
        this.setState({isUpdated: true});
        } catch (err) {
            this.setState({errorEdit: err.response.data});
        }
    
    }

    handleUpdatePassword = async (e) => {
        e.preventDefault();
        const {_id, adminPassword, password, confirmPassword} = this.state;
        try {
            const jwt = getCookie("jwt");
        await this.props.updateAdminPassword(_id, adminPassword, password, confirmPassword, jwt);
        this.setState({isUpdated: true});
        } catch (err) {
            this.setState({errorPassword: err.response.data});
        }
    }
    render() {
               const { name, email } = this.state;    
        const renderForm = (
            <div className="ui form">
                <form id="updateAdmin">
                    <label>Edytuj dane:</label>
                    <div className="panel-form-container"><div className="panel-form-header">Dane podstawowe:</div>
                    <div className="field">
                        <label>Imię i nazwisko</label>
                        <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Adres email</label>
                        <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Podaj SWOJE hasło w celu autoryzacji</label>
                        <input
                        type="password"
                        name="adminPasswordData"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <label className="error-message">{this.state.errorEdit}</label>
                    <button className="panel-button" form="updateAdmin" onClick={this.handleUpdate}>Edytuj dane</button>
                </form>
                
                <form id="updateAdminPassword">
                    <label>Edytuj hasło:</label>
                    <div className="panel-form-container"><div className="panel-form-header">Hasło:</div>
                    <div className="field">
                        <label>Podaj SWOJE hasło w celu autoryzacji</label>
                        <input
                        type="password"
                        name="adminPassword"
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
                        <label>Potwierdź nowe hasło</label>
                        <input
                        type="password"
                        name="confirmPassword"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <label className="error-message">{this.state.errorPassword}</label>
                    <button className="panel-button" form="updateAdminPassword" onClick={this.handleUpdatePassword}>Zmień hasło</button><div></div>
                </form>
            </div>
        )
        return <div>{this.state.isUpdated ? <Redirect push to="/admin/admins"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { admin: state.admin };

};

export default connect(
    mapStateToProps,
    { getAdmin, updateAdmin, updateAdminPassword }
    )(UpdateAdminForm);