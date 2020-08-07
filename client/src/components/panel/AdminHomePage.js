import React from 'react';
import Header from './Header';
import NavigationBar from './NavigationBar';
import Content from './Content';
import { connect } from 'react-redux';
import { getCookie } from '../../js/index';
import { getAdmin, adminLogout } from '../../actions';


class AdminHomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            isLogged: false,
            return: false
        }
    }
    componentDidMount = async () => {
        let id = getCookie('adminId');
        const jwt = getCookie('jwt');
        try {
        await this.props.getAdmin(id, jwt)
        if(this.props.name) {
            this.setState({isLogged: true})
        }
        } catch (err) {
            console.log(err)
        }
    }

    adminLogOut = async () => {
        await this.props.adminLogout();
        window.location.reload();
    }

    render() {

        return (
            <div id="main-panel-container">
                <Header admin={this.props.admin} adminLogOut={this.adminLogOut}/>
                <div className="panel-content">
                <NavigationBar/>
                <Content/>
                </div>
            </div>           
        )
    }
}

const mapStateToProps = state => {
    return { admin: state.admin };
};
export default connect(
    mapStateToProps,
    { getAdmin, adminLogout }
)(AdminHomePage);