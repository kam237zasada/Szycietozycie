import React from 'react';
import { connect } from 'react-redux';
import { getAdmin } from '../../actions';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state= { name: ''}
    }

    async componentDidMount(){
        let id = localStorage.getItem('id');
        await this.props.getAdmin(id);
        this.setState({name: this.props.admin.name})

    }
    render() {
        
        return(
            <div className="panel-header-container">
                <div className="panel-header-item">Panel Szycie to zycie</div>
                <div className="panel-header-item">Zalogowany jako: {this.state.name} <FontAwesomeIcon icon={faSignOutAlt}/></div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return { admin: state.admin };
};
export default connect(
    mapStateToProps,
    { getAdmin }
)(Header);
