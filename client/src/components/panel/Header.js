import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


function Header({admin, adminLogOut}) {
    return (
        <div className="panel-header-container">
                <div className="panel-header-item">Panel Szycie to zycie</div>
                <div className="panel-header-item">Zalogowany jako: {admin.name} <button className="panel-button" onClick={adminLogOut.bind()}><FontAwesomeIcon icon={faSignOutAlt}/></button></div>
            </div>
    )

}

export default Header
