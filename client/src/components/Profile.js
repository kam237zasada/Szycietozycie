import React from 'react';
import ProfileMenu from './ProfileMenu';

function Profile({customer}){

        return(
            <div className="shop-header-item">
                {customer.login ? <div className="shop-header-profile"><span>Witaj, {customer.login}!    </span><ProfileMenu/></div> : <div><span><a href="/sklep/login">Zaloguj się</a></span><span><a href="/sklep/rejestracja">Rejestracja</a></span></div>} 
                </div>
            )
    }

export default Profile