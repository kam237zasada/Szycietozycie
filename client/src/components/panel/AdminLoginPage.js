import React from 'react';
import { connect } from 'react-redux';
import { adminLogin } from '../../actions';
import { Redirect } from 'react-router-dom';

class AdminLoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {logged: false, email: '', password: ''};
    }

    async componentDidMount() {
        const id = localStorage.getItem('id');
        if(id) {this.setState({logged: true})}
    }
    async componentDidUpdate() {
        const id = localStorage.getItem('id');
        if(id) {this.setState({logged: true})}
    }

    handleSubmit = async event => {
        event.preventDefault();
        const {email, password} = this.state;
        this.props.adminLogin(email, password);
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
                        <label>Password</label>
                        <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <button className="" form="adminLogin" onClick={this.handleSubmit}>Log in!</button>
                </form>
            </div>
            </div>
        )

        return(
            <div> 
                {this.state.logged ? <Redirect push to="/admin/home" /> : mustLogin }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { admin: state.admin };
};
export default connect(
    mapStateToProps,
    { adminLogin }
)(AdminLoginPage);