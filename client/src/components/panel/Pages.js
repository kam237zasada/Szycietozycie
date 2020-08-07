import React from 'react';
import {changeLocation} from '../../js/index'

export function Pages({overallPages, currentPage, page}) {
    return (
        overallPages.map( element => {
            if(overallPages.length < 4) {
            if(currentPage==element) {
        return (
            <button className="button-basket disabled page" disabled="true">{element}</button>
            )
        } else {
            if(page) {
                let location = changeLocation(window.location.pathname);
                return <a href={`${location}/${element}`} title="Przejdź do strony"><button className="button-basket page">{element}</button></a>
            } else {
                return <a href={`${window.location.pathname}/page/${element}`} title="Przejdź do strony"><button className="button-basket page">{element}</button></a>
            }
            }
        } else {
            if(currentPage==element) {
                return (
                    <button className="button-basket disabled page" disabled="true">{element}</button>
                )
            
        } else if(currentPage == element-1 && element!=overallPages.length || currentPage == element+1) {
            
                if(page) {
                    let location = changeLocation(window.location.pathname);
                    return <a href={`${location}/${element}`} title="Przejdź do strony"><button className="button-basket page">{element}</button></a>
                } else {
                    return <a href={`${window.location.pathname}/page/${element}`} title="Przejdź do strony"><button className="button-basket page">{element}</button></a>
                }
        }  else if(element===overallPages.length) {
            if(currentPage == element-1 || currentPage == element -2) {
                if(page) {
                    let location = changeLocation(window.location.pathname);
                    return <a href={`${location}/${element}`} title="Przejdź do strony"><button className="button-basket page">{element}</button></a>
                } else {
                    return <a href={`${window.location.pathname}/page/${element}`} title="Przejdź do strony"><button className="button-basket page">{element}</button></a>
                } 
            } else {
                if(page) {
                    let location = changeLocation(window.location.pathname);
                    return (
                    <><span>...</span>
                    <a href={`${location}/${element}`} title="Przejdź do strony"><button className="button-basket page">{element}</button></a></>
                    )
                } else {
                    return (
                    <><span>...</span>
                    <a href={`${window.location.pathname}/page/${element}`} title="Przejdź do strony"><button className="button-basket page">{element}</button></a></>
                    )
                }
            }
        }

        }
    }
    )
    )
}