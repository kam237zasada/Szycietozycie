import React from 'react';
import ShopMenu from './ShopMenu';
import {getProductsByQuery, getCategory} from '../actions';
import { connect } from 'react-redux';
import { changeView, changeString } from '../js/index';

function ProductItem({product}) {
    let newPrice = changeView(product.price);
    let newString = changeString(product.name);
    return (
        <div className="product-card">
            <div className="place-image">
                <img className="product-image" src={product.productImage} alt={newString}/>
            </div>
            <div className="product-content">
            <a href={`/sklep/p/${newString}/${product.ID}`}className="product-name">{product.name}</a>
                <div className="product-price">{newPrice} zł</div>
            </div>
        </div>

    )
}

function ProductsTable({products}) {
    return products.map( product => <ProductItem product={product} key={product._id}/>)
   }

class QueryView extends React.Component {
    constructor(props) {
        super(props)
        this.state= {_id: '', name: '', categoryId:'', category: '', color:'', description:'', productCode: '', price: '', numberInStock: '', productImage: '', empty: false, loaded: false}
    }

componentDidMount = async () => {
    await this.props.getProductsByQuery(this.props.match.params.query);
    this.setState({loaded: true})
    if(this.props.products.length===0) {this.setState({empty: true})};
}
    render() {

        const noProducts = (
            <div>Niestety nie ma produktów dla wyszukiwania <span style={{fontWeight:"bold"}}>"{this.props.match.params.query}"</span> . Sprawdź jeszcze raz kryteria wyszukiwania.</div>
        )
        const showResults = (
            <div className="shop-items"><div className="links" style={{textAlign: "left"}}><a href="/sklep">Strona główna</a></div>
                <div className="query-message">Wyniki wyszukiwania dla zapytania <span style={{fontWeight: "bold"}}>"{this.props.match.params.query}"</span> :</div>
                {this.state.empty ? noProducts : <ProductsTable products={this.props.products}/>}</div>
        )

        const loading = ( <div>...Wczytuję dane...</div>

        )

        return(
            <div className="shop-content"><ShopMenu/>
            {this.state.loaded ? showResults : loading}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { products: state.products, category: state.category };
};
export default connect(
    mapStateToProps,
    { getProductsByQuery, getCategory }
)(QueryView);