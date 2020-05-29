import React from 'react';
import ShopMenu from './ShopMenu';
import { getProduct, addBasket, updateBasket } from '../actions';
import { connect } from 'react-redux';
import { changeView, getCookie } from '../js/index';


class ProductView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            _id: '',
            name: '',
            price: '',
            description: '',
            productCode: '',
            numberInStock: '',
            productImage: '',
            color: '',
            loaded: false,
            error: '',
            available: false,
            amount: 1,
            noInStock:''
        }
    }

    componentDidMount = async () => {
        try {
            await this.props.getProduct(this.props.match.params.id);
        } catch (err) {
            return this.setState({error: err.response.data});
        }
        this.setState({_id: this.props.product._id});
        this.setState({productImage: this.props.product.productImage})
        this.setState({name: this.props.product.name})
        let price = changeView(this.props.product.price);
        this.setState({price: price})
        this.setState({description: this.props.product.description})
        this.setState({numberInStock: this.props.product.numberInStock})
        this.setState({productCode: this.props.product.productCode})
        this.setState({color: this.props.product.color})
        if(this.state.numberInStock > 0) {this.setState({available: true})}
    }

    handleChange = event => {
        switch (event.target.name) {
            case 'amount':
                this.setState({ amount: event.target.value });
                break;
            default:
                break;
        }
    }

    handleSubstract = e => {
        e.preventDefault();
        if(this.state.amount===1) {return}
        this.setState({amount: this.state.amount -1})
    }

    handleAdd = e => {
        e.preventDefault();
        this.setState({amount: this.state.amount +1})
    }

    howMany = () => {
        if(this.state.numberInStock > 9) {
            return <div className="species-how-many">Duża ilość</div>
        } else if (this.state.numberInStock > 5) {
            return <div className="species-how-many">Średnia ilość</div>
        } else if (this.state.numberInStock > 0) {
            return <div className="species-how-many">Mała ilość</div>
        } else {
            return null
        }
    }

    addToBasket = async () => {
        try {
        let basketId = getCookie("basketId");
        if(!basketId || basketId==="") {
            await this.props.addBasket(this.state._id, this.state.amount)
        } else {
            await this.props.updateBasket(basketId, this.state._id, this.state.amount, "insertion")
        }}
        catch(err) {
            this.setState({noInStock: err.response.data});
        }
    }


    render() {
        const available = (
            <div className="available">Produkt dostępny!</div>
        )

        const unavailable =(
            <div className="unavailable">Produkt niedostepny!</div>
        )

        const basket = (
            <div className="species-basket"><div><span style={{color: 'red'}}>{this.state.noInStock}</span></div>
                <input className="button-basket" type="button" value="DODAJ DO KOSZYKA" onClick={this.addToBasket}/></div>
        )

        const checkAvailability = (
            <div className="species-basket"><input className="button-basket" type="button" value="SPRAWDŹ DOSTĘPNOŚĆ"/></div>
        )
        
        const renderProduct = (
            <div className="product-view-container">
            <div className="product-view-content">
                <div className="product-view-image"><img src={this.state.productImage} alt={this.state.name}/></div>
                <div className="product-view-species">
                    <h2 className="species-name">{this.state.name}</h2>
                    <div className="species-price">{this.state.price} zł</div>
                    <div className="species-shipment">Wysyłka: 10 dni</div>
                    <div className="species-color">Kolor: {this.state.color}</div>
                    <div className="species-availability">{this.state.available ? available : unavailable}</div>
                    {this.howMany()}
                    { this.state.available ? <div className="species-amount"><input className="button-amount" type="button" value="-" onClick={this.handleSubstract}/><input className="input-amount" type="text" value={this.state.amount} name="amount" onChange={this.handleChange}/><input className="button-amount" type="button" value="+" onClick={this.handleAdd}/></div> : null}
                    { this.state.available ? basket : checkAvailability}
                    <div className="species-productCode">Kod produktu: {this.state.productCode}</div>
                    </div>
            </div>
            <div className="product-view-description">
                <h2 className="description-header">Opis:</h2>
                <div>{this.state.description}</div>
            </div>
            </div>
        )
        const error = (
            <div>{this.state.error}, wróć na <a href="/sklep">Stronę główną</a> sklepu</div>
        )

        return(
            
            
            <div className="shop-content"><ShopMenu/>
            {this.state.error==="" ? renderProduct : error}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { product: state.product, basket: state.basket };
};
export default connect(
    mapStateToProps,
    { getProduct, addBasket, updateBasket }
)(ProductView);