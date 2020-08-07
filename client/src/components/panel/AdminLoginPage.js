import React from 'react';
import { connect } from 'react-redux';
import { adminLogin, getAdmin } from '../../actions';
import { Redirect } from 'react-router-dom';
import { getCookie, deleteCookie, setCookie } from '../../js/index';
import AdminHomePage from './AdminHomePage';

class AdminLoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {logged: false, email: '', password: '', error: ''};
    }

    async componentDidMount() {
        const id = getCookie('adminId');
        try {
            await this.props.getAdmin(id)
        if(this.props.admin.name) {this.setState({logged: true})} else {
            setCookie('adminId', '', 0.0005)
        }
        } catch (err) {
            console.log(err)
        }
    }
    

    handleSubmit = async event => {
        event.preventDefault();
        const {email, password} = this.state;
        try {
        await this.props.adminLogin(email, password);
        this.setState({logged: true});
        } catch (err) {
            console.log(err.response.data);
            this.setState({error: err.response.data})
        }
    }

    handleChange = event => {
        switch (event.target.name) {
            case 'email':
                this.setState({ email: event.target.value });
                break;
            case 'password':
                this.setState({ password: event.target.value });
                break;
            default:
                break;
        }
    };

    render() {
        const { email, password} = this.state;
        const mustLogin = (
            <div>
            <div className="">
                <form id="adminLogin">
                    <div className="">
                        <label>Email</label>
                        <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="">
                        <label>Hasło</label>
                        <input
                        type="password"
                        name="password"
                        placeholder="hasło..."
                        value={password}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <button className="panel-button" form="adminLogin" onClick={this.handleSubmit}>Log in!</button>
                    <div className="error-message">{this.state.error}</div>
                </form>
            </div>
            </div>
        )


        return(
            <div> 
                {this.state.logged ? <AdminHomePage/> : mustLogin }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { admin: state.admin };
};
export default connect(
    mapStateToProps,
    { adminLogin, getAdmin }
)(AdminLoginPage);