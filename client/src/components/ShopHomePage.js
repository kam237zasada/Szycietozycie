import React from 'react';
import ShopMenu from './ShopMenu';
import {getProducts, getCategory} from '../actions';
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

class ShopHomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state= {_id: '', name: '', categoryId:'', category: '', color:'', description:'', productCode: '', price: '', numberInStock: '', productImage: ''}
    }

componentDidMount = async () => {
    await this.props.getProducts();
}
    render() {
        return(
            <div className="shop-content"><ShopMenu/>
            <div className="shop-items"><ProductsTable products={this.props.products}/></div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { products: state.products, category: state.category };
};
export default connect(
    mapStateToProps,
    { getProducts, getCategory }
)(ShopHomePage);