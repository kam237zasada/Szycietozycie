import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';

function Basket(){

        return(
            <div className="shop-header-item"><a href="/sklep/b/basket"><FontAwesomeIcon icon={faShoppingBasket}/></a></div>
            )
    }

export default Basket