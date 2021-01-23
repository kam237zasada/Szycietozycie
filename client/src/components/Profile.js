import React from 'react';
import ProfileMenu from './ProfileMenu';

function Profile({customer}){

        return(
            <div className="shop-header-item header-item">
                {customer.login ? <div className="shop-header-profile"><span>Witaj, {customer.login}!    </span><ProfileMenu/></div> : <div><span><a className="header-item" href="/sklep/login">Logowanie<i className="fas fa-user-circle shop-header-item"></i></a></span></div>} 
                </div>
            )
    }

export default Profile