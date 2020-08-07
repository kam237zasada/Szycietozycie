import React from 'react'
import { changeString } from '../js/index'

function NavigationLine({category, product, query}) {
    if(product===undefined && query===undefined) {
        let categoryString = changeString(category.name);
    return (
    <div className="navigation-line"><a href="/sklep"><p><i className="fas fa-home"></i></p></a><p>-</p><a href={`/sklep/c/${categoryString}/${category.ID}`}><p>{category.name}</p></a></div>
    )}
    else if (query===undefined){
        let categoryString = changeString(category.name);
        return (<div className="navigation-line"><a href="/sklep"><p><i className="fas fa-home"></i></p></a><p>-</p><a href={`/sklep/c/${categoryString}/${category.ID}`}><p>{category.name}</p></a><p>-</p><p>{product.name}</p></div>
        )
    }
    else if (category===undefined && product===undefined) {
        return (<div className="navigation-line"><a href="/sklep"><p><i className="fas fa-home"></i></p></a><p>-</p><p>{query}</p></div>
        )
    }
}

export default NavigationLine