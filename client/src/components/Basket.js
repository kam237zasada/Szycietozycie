import React from 'react';

function Basket({products}){

        return(
            <div className="shop-header-menu header-item"><a className="header-item" href="/sklep/b/basket"><i className="fas fa-shopping-basket shop-header-item"></i></a>
            <div className="basket-items">{products}</div></div>
            )
    }

export default Basket