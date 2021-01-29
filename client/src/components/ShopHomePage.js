import React from 'react';
import ShopMenu from './ShopMenu';
import NavigationLine from './NavigationLine';
import SearchError from './SearchError';
import { Pages } from './panel/Pages';
import {getProducts, getProductsByQuery, getProductsByCategory, getCategory, getProductsByFilters, addBasket, updateBasket, getProduct} from '../actions';
import { baseURL } from '../api/index';
import { connect } from 'react-redux';
import { changeView, changeString, getCookie } from '../js/index';


class ShopHomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            loaded: false,
            currentPage : 1,
            searchError: false,
            categoryError: false,
            overallPages: [],
            goToPage: '',
            category: {},
            priceA: '',
            priceB: '',
            filterError: '',
            sort: '',
            showFilters: false,
            productError: ''
        }
    }

componentDidMount = async () => {
    let page = 1;
        if(this.props.match.params.pageNumber) {
            page = this.props.match.params.pageNumber
        }
        this.setState({currentPage: page});
    let sort = this.props.match.params.sort;
    if(!sort) {
        sort = "-dateAdded"
    }
    this.setState({sort: sort})
    let priceA = this.props.match.params.priceA
    let priceB = this.props.match.params.priceB
    
    if(!priceA) { priceA = 0} else if(priceA!=0) { this.setState({priceA: priceA})}
        if(!priceB ) { priceB = 0} else if(priceB!=0) { this.setState({priceB:priceB })}



        if(this.props.match.params.query) {
            

            let head = document.getElementsByTagName("head");
        let title = document.getElementsByTagName("title");
        title[0].innerHTML = `Wyniki wyszukiwania dla ${this.props.match.params.query}`;
        let description = document.createElement("meta");
        description.setAttribute("name", "description");
        description.setAttribute("content", "Sklep internetowy");
        head[0].appendChild(description)
            
            await this.props.getProductsByQuery(this.props.match.params.query, priceA, priceB, sort, page)
            if(priceA!=0 && priceA) { this.setState({priceA: priceA})}
            if(priceB!=0 && priceB) { this.setState({priceB: priceB})}
            if(this.props.products.length===0) {
                this.setState({searchError: true})
            }

        } else if(this.props.match.params.categoryId){
            await this.props.getProductsByCategory(this.props.match.params.categoryId, priceA, priceB, sort, page);
            await this.props.getCategory(this.props.match.params.categoryId);
            this.setState({category: this.props.category})
            if(this.props.products.length===0) {
                this.setState({categoryError: true})
            }
        } else { 
            await this.props.getProducts(priceA, priceB, sort, page); 
        }    
        this.setState({products: this.props.products.products})
        this.setState({productsLength: this.props.products.length})
        let array = [];
        if(this.state.productsLength>0) {
        let toRound = this.state.productsLength/20;
        let pages = Math.ceil(toRound);
        for(let i=0 ;i<pages;i++) {
            let x = i+1;
            array.push(x)
         }
         }
        this.setState({overallPages: array})

    this.setState({loaded: true})
}

    handleCloseBasketForm = () => {
        let basketForm = document.getElementById("basket-form")
        basketForm.remove();
        let mask = document.getElementById("mask");
        mask.remove();   
    }

addToBasket = async e => {
    let error = document.getElementsByClassName("product-error");
    error = Array.from(error);
    error.map(element => {
        return element.innerText=""
    })
    let name = e.target.name;
    await this.props.getProduct(e.target.id);
    if(this.props.product.color.length > 0) {
        let div = document.getElementById(name)
        return div.innerText="Aby dodać produkt do koszyka musisz wybrać jego kolor, kliknij w zdjęcie"
    }
    if(this.props.product.variant.name != "") {
        let div = document.getElementById(name)
        return div.innerText="Aby dodać produkt do koszyka musisz wybrać wariant, kliknij w zdjęcie"
    }
    try {
    let basketId = getCookie("basketId");
    if(!basketId || basketId==="") {
        await this.props.addBasket(this.props.product._id, '', '', '', 1)
    } else {
        await this.props.updateBasket(basketId, this.props.product._id, 1, "insertion", '', '', '')
    }}
    catch(err) {
        let div = document.getElementById(name)
        return div.innerText=err.response.data
    }
    let root = document.getElementById("root");
    let mask = document.createElement("div");
    mask.setAttribute("id", "mask");
    root.after(mask);
    let basketForm = document.createElement("div");
    basketForm.setAttribute("class", "basket-form-container");
    basketForm.setAttribute("id", "basket-form");
    let message = document.createElement("div");
    message.setAttribute("class", "basket-form-message")
    message.innerText="Produkt prawidłowo dodany do koszyka";
    basketForm.appendChild(message);
    let buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class", "basket-form-button-container");
    basketForm.appendChild(buttonContainer);
    let link = document.createElement("a");
    link.setAttribute("href", "/sklep/b/basket");
    let buttonReturn = document.createElement("button")
    let buttonBasket = document.createElement("button")
    buttonReturn.setAttribute("class", "button-basket");
    buttonBasket.setAttribute("class", "button-basket");
    buttonReturn.innerText = "WRÓĆ NA ZAKUPY";
    buttonBasket.innerText = "PRZEJDŹ DO KOSZYKA";
    buttonReturn.addEventListener("click", this.handleCloseBasketForm)
    buttonContainer.appendChild(buttonReturn);
    buttonContainer.appendChild(link);
    link.appendChild(buttonBasket);

    root.after(basketForm);

}


renderProducts = () => {
    return this.state.products.map(product => {
        let newPrice = changeView(product.price);
        let newString = changeString(product.name);

        return (
            <div className="product-card">
                <a href={`/sklep/p/${newString}/${product.ID}`}><div className="place-image">
                <img className="product-image" src={product.productImage[0]} alt={newString}></img>
                </div></a>
                <div className="product-content">
                    <a href={`/sklep/p/${newString}/${product.ID}`}className="product-name">{product.name}</a>
                    <div className="product-price">{newPrice} zł</div>
                </div>
                <div className="product-button-basket">
                    {product.numberInStock>0 ? <button className="button-basket" id={product.ID} name={product._id} onClick={this.addToBasket}>DO KOSZYKA</button> : 
                    <button className="button-disabled" disabled>PRODUKT NIEDOSTĘPNY</button>}
                </div>
                <span style={{color: "red"}}><div className="product-error" id={product._id}></div></span>
            </div>
    )
})
}

handleChange = e => {
    switch(e.target.name) {
        case 'page':
            this.setState({goToPage: e.target.value})
            break;
        case 'priceA':
            this.setState({priceA: e.target.value})
            break;
        case 'priceB':
            this.setState({priceB: e.target.value})
            break;
        case 'sort':
            this.setState({sort: e.target.value})
            break;
        default:
            break;
    }
}

handleGoToPage = e => {
    e.preventDefault();
    let page = Number(this.state.goToPage);
    if(isNaN(page)) {
        return this.setState({pageError: "Podany znak musi być liczbą!"})
    }
    if(page > this.state.overallPages.length) {
        page = this.state.overallPages.length;
    }

    if(this.props.match.params.query) {
        window.location.replace(`${baseURL}/sklep/q/szukaj/query=${this.props.match.params.query}/page/${page}`)
    } else if(this.props.match.params.categoryId) {
        window.location.replace(`${baseURL}/sklep/c/${this.props.match.params.categoryname}/${this.props.match.params.categoryId}/page/${page}`)
    }
    else {
    window.location.replace(`${baseURL}/sklep/page/${page}`)
    }        
}

handleFilter = e => {
    e.preventDefault();
    const {  query, categoryId, sort} = this.props.match.params
    if(isNaN(this.state.priceA) || isNaN(this.state.priceB)) { return this.setState({filterError: "Do filtrowania ceny, muszą zostać podane liczby!"})}
    if(this.state.priceA>this.state.priceB && this.state.priceB!=="") { return this.setState({filterError: "Kwota maksymalna nie może być mniejsza od minimalnej!"})}
    let priceA = this.state.priceA;
    let priceB = this.state.priceB;
    if(priceA==="") {
        priceA= 0;
    }
    if(priceB==="") {
        priceB= 0;
    }

    if(query) {
        if(sort) {
            window.location.replace(`${window.location.origin}/sklep/q/szukaj/query=${query}/pricefrom=${priceA}/priceto=${priceB}/sort=${this.state.sort}`)
        } else {
            window.location.replace(`${window.location.origin}/sklep/q/szukaj/query=${query}/pricefrom=${priceA}/priceto=${priceB}`)
        }
    } else if(categoryId) {
        let newString = changeString(this.props.category.name)
        if(sort) {
            window.location.replace(`${window.location.origin}/sklep/c/${newString}/${this.props.category.ID}/pricefrom=${priceA}/priceto=${priceB}/sort=${this.state.sort}`)
        } else {
            window.location.replace(`${window.location.origin}/sklep/c/${newString}/${this.props.category.ID}/pricefrom=${priceA}/priceto=${priceB}`)
        }
    } else {
        if(sort) {
            window.location.replace(`${window.location.origin}/sklep/pricefrom=${priceA}/priceto=${priceB}/sort=${this.state.sort}`)
        } else {
            window.location.replace(`${window.location.origin}/sklep/pricefrom=${priceA}/priceto=${priceB}`)
        }
    }
}

handleSort = e => {
    e.preventDefault();
    const { priceA, priceB, query, categoryId} = this.props.match.params

    if(query) {
        if(priceA) {
            window.location.replace(`${window.location.origin}/sklep/q/szukaj/query=${query}/pricefrom=${priceA}/priceto=${priceB}/sort=${this.state.sort}`)
        } else {
            window.location.replace(`${window.location.origin}/sklep/q/szukaj/query=${query}/sort=${this.state.sort}`)
        }
    } else if(categoryId) {
        let newString = changeString(this.props.category.name)
        if(priceA) {
            window.location.replace(`${window.location.origin}/sklep/c/${newString}/${this.props.category.ID}/pricefrom=${priceA}/priceto=${priceB}/sort=${this.state.sort}`)
        } else {
            window.location.replace(`${window.location.origin}/sklep/c/${newString}/${this.props.category.ID}/sort=${this.state.sort}`)
        }
    } else {
        if(priceA) {
            window.location.replace(`${window.location.origin}/sklep/pricefrom=${priceA}/priceto=${priceB}/sort=${this.state.sort}`)
        } else {
            window.location.replace(`${window.location.origin}/sklep/sort=${this.state.sort}`)
        }
    }
}

handleShowFilters = () => {
    if(!this.state.showFilters) {
        this.setState({showFilters: true})
    } else {
        this.setState({showFilters: false})
    }
}

renderSort = () => {

                let array = [
                    {value:"-dateAdded", text: "Domyślnie - od najnowszych"},
                    {value:"price", text: "Cena - od najtańszych"},
                    {value:"-price", text: "Cena - od najdroższych"},
                    {value:"-views", text: "Według popularności"},
                ]

                return array.map(element => {
                    if(this.state.sort===element.value) {
                        return <option value={element.value} selected>{element.text}</option>
                    } else {
                        return <option value={element.value}>{element.text}</option>

                    }
                })
}


    render() {

        const renderPagination = (
            <>
            <Pages overallPages={this.state.overallPages} currentPage={this.state.currentPage} page={this.props.match.params.pageNumber}/>
                    <form id="page-number-form">
                        <input
                        className="page-number"
                        type="text"
                        onChange={this.handleChange}
                        name="page"
                        /><button className="panel-button" form="page-number-form" onClick={this.handleGoToPage}>Przejdź do strony</button>
                        <span>{this.state.pageError}</span>
                        </form></>
        )

        const renderProducts = (
            <>{this.renderProducts()}</>

        )

        const emptyCategory = (
            <>{this.props.match.params.priceA ? <><div className="search-error-container"><div>Nie ma produktów dla podanych filtrów w tej kategorii.</div><h2>Produkty, które mogą Ci się spodobać:</h2></div></> :
             <><div className="search-error-container"><div>Nie ma produktów w tej kategorii.</div><h2>Produkty, które mogą Ci się spodobać:</h2></div></>}
            <SearchError /></>
        )

        const emptyQuery = (
            <>{this.props.match.params.priceA ? 
            <><div className="search-error-container"><div>Nie ma produktów dla podanych filtrów... dla wyszukiwania <span style={{fontWeight:"bold"}}>"{this.props.match.params.query}"</span> </div>
            <h2>Produkty, które mogą Ci się spodobać:</h2></div><SearchError /></>
             :
        <><div className="search-error-container"><div>Niestety nie ma produktów dla wyszukiwania <span style={{fontWeight:"bold"}}>"{this.props.match.params.query}"</span> . Sprawdź jeszcze raz kryteria wyszukiwania.</div>
        <h2>Produkty, które mogą Ci się spodobać:</h2></div><SearchError /></>}
        </>

        )
        const noProducts = (
            <>{this.state.categoryError ? emptyCategory : emptyQuery}</>
        )

        const renderContent = (
            <>{this.props.match.params.query ? <NavigationLine query={this.props.match.params.query}/> : null}
                        {this.props.match.params.categoryId ? <NavigationLine category={this.state.category}/> : null}

            <div className="shop-content"><ShopMenu categoryId={this.state.category.ID}/>
            <div className="shop-content-container">
                <div className="shop-filter-container-mobile">
                    <div className="filter-mobile-header">
                        <div>Filtruj produkty</div>
                        <button onClick={this.handleShowFilters} className="filter-button"><i className="fas fa-arrow-circle-down"></i></button>
                    </div>
                    {this.state.showFilters ? <div className="filter-mobile-content">
                        <form className="filter-form">
                            <label>Cena:</label>
                            <div><label>OD: 
                                <input
                                type="text"
                                className="filter-input"
                                name="priceA"
                                onChange={this.handleChange}
                                value={this.state.priceA}/>
                            </label>
                            <label>DO: 
                                <input
                                type="text"
                                className="filter-input"
                                name="priceB"
                                onChange={this.handleChange}
                                value={this.state.priceB}/>
                            </label><button onClick={this.handleFilter} className="button-basket-small">FILTRUJ</button></div>
                            </form>
                            <div className="filter-form">
                                <label>Sortuj:</label> 
                                <div><select name="sort"onChange={this.handleChange}>
                        {this.renderSort()}
                        
                    </select><button onClick={this.handleSort} className="button-basket-small">SORTUJ</button></div></div>
                    <div>                            {this.state.filterError}
</div>
                    </div> : null}
                    
                </div>
            <div className="shop-filter-container">
                    <form id="filter-by-price">
                        <label>
                            <span style={{fontSize:"25px"}}>Filtruj po cenie:
                            Od: <input 
                            type="text"
                            className="filter-input"
                            name="priceA"
                            onChange={this.handleChange}
                            value={this.state.priceA}
                            />
                            Do: <input 
                            type="text"
                            className="filter-input"
                            name="priceB"
                            onChange={this.handleChange}
                            value={this.state.priceB}
                            /></span>
                            {this.state.filterError}
                        </label>
                        <button onClick={this.handleFilter} className="button-basket" style={{margin: "5px"}}>FILTRUJ</button>
                    </form>
                    <label>
                    Sortuj: <select name="sort"onChange={this.handleChange}>
                        {this.renderSort()}
                        
                    </select>
                    <button onClick={this.handleSort} className="button-basket">SORTUJ</button>
                    </label>
                </div>
            <div className="shop-items">
                
                {this.state.categoryError || this.state.searchError ? noProducts : renderProducts}
                </div>
                
            </div>
            </div></>
            
        )

        const loading = (
            <div>Wczytywanie danych...</div>
        )
        return(
            <>
            {this.state.loaded ? renderContent : loading}
            <div className="pagination">{this.state.overallPages.length > 1 ? renderPagination: null}
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return { products: state.products, category: state.category, product: state.product };
};
export default connect(
    mapStateToProps,
    { getProducts, getProductsByQuery, getProductsByCategory, getCategory, getProductsByFilters, addBasket, updateBasket, getProduct }
)(ShopHomePage);