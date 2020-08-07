import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faUserCircle} from '@fortawesome/free-solid-svg-icons';
import { customerLogout } from '../actions';
import { connect } from 'react-redux';



class ProfileMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state={dropdown:false}
    }
    dropdownButton = async e => {
        e.preventDefault();
        if(!this.state.dropdown) {
            this.setState({dropdown: true})
        }
        else { this.setState({dropdown: false})}
    }
    handleLogout = async e => {
        e.preventDefault();
        await this.props.customerLogout();
        window.location.reload();
    }

    render() {

        const dropdownmenu = (
            <><div className="shop-dropdown-menu">
            <a href="/sklep/my_account"><div className="shop-dropdown-item">Moje konto</div></a>
            <a href="/sklep/b/basket"><div className="shop-dropdown-item">Koszyk</div></a>
            <a href="/sklep/my_orders"><div className="shop-dropdown-item">Zamówienia</div></a>
            <a href="/sklep" className="shop-dropdown-item" onClick={this.handleLogout}>Wyloguj się</a>
            </div></>
        )
        return(
            <div>
                <a onClick={this.dropdownButton}><FontAwesomeIcon icon={faUserCircle}/></a>
                <div>{this.state.dropdown ? dropdownmenu: null}</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { customer: state.customer };
};

export default connect(
    mapStateToProps,
    { customerLogout }
    )(ProfileMenu);