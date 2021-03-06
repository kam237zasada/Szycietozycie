import React from 'react';
import { getPopularProducts, addBasket, updateBasket, getProduct} from '../actions';
import { connect } from 'react-redux';
import { changeView, changeString, getCookie } from '../js/index';


class SearchError extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            loaded: false,
            productError: ''
        }
    }

componentDidMount = async () => {
    
    await this.props.getPopularProducts();
    this.setState({products: this.props.products})
    

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


    render() {

        const renderContent = (
                
            
            <div className="shop-items">
                
                <>{this.renderProducts()}</>
                </div>
                
            
        )

        const loading = (
            <div>Wczytywanie danych...</div>
        )
        return(
            <>
            {this.state.loaded ? renderContent : loading}
            </>
        )
    }
}

const mapStateToProps = state => {
    return { products: state.products, product: state.product };
};
export default connect(
    mapStateToProps,
    { getPopularProducts, addBasket, updateBasket, getProduct }
)(SearchError);