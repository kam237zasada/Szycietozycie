import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHome, faSortDown } from '@fortawesome/free-solid-svg-icons';

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {dropdown: false}
    }

handleClickDropdown = async e => {
    e.preventDefault();
    if(!this.state.dropdown) {
        this.setState({dropdown: true})
    }
    else { this.setState({dropdown: false})}
}


    render() {

        const dropdownmenu = (
            <div className="dropdown-menu">
                <a href="/o-mnie"><div className="dropdown-item">O MNIE</div></a>
                <a href="/sklep"><div className="dropdown-item">SKLEP</div></a>
                <a href="/cennik"><div className="dropdown-item">CENNIK</div></a>
                <a href="/kontakt"><div className="dropdown-item">KONTAKT</div></a>
            </div>
        )
        return (
            <div className="header"><div className="header-container">
                <div className="header-logo header-item"><a href="/"><FontAwesomeIcon icon={faHome}/></a></div>
                <a href="/o-mnie"><div className="header-item">O MNIE</div></a>
                <a href="/sklep"><div className="header-item">SKLEP</div></a>
                <a href="/cennik"><div className="header-item">CENNIK</div></a>
                <a href="/kontakt"><div className="header-item">KONTAKT</div></a>
            </div>
            <div className="header-small">
            <div className="header-logo header-small-item"><a href="/"><FontAwesomeIcon  icon={faHome}/></a></div>
            <button className="header-small-item unfold-button" onClick={this.handleClickDropdown}>MENU <FontAwesomeIcon className="arrow-icon" icon={faSortDown}/></button>
            </div>
            <div>{this.state.dropdown ? dropdownmenu : null}</div>
            </div>
            
        )
    }
}
export default Header;