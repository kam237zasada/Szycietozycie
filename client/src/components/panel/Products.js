import React from 'react';
import { getProducts, deleteProduct, getProduct } from '../../actions';
import { connect } from 'react-redux';
import {changeView } from '../../js/index';


function ProductItem({product}) {
   
    let newPrice = changeView(product.price);
    
    return (
        <tr>
            <td data-label="Produkt"><a href={`/admin/produkty/${product.ID}`}>{product.name}</a></td>
            <td data-label="Magazyn">{product.numberInStock}</td>
            <td data-label="Cena">{newPrice}</td>
            <td data-label="Akcje"><a href={`/admin/produkty/${product.ID}`}><button className="panel-button">EDYTUJ</button></a></td>
        </tr>
    )
}

function ProductsTable({products}) {

    return products.map( product => <ProductItem product={product} key={product.ID}/>)
   }

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {_id: null,
            name: '',
            category: '',
            categoryId: '',
            color: '',
            productCode:'',
            description: '',
            file: null,
            numberInStock: '',
            price:'',
            changedPrice: '',
            error: '',
            productImage: ''}
    }
    async componentDidMount() {
       await this.props.getProducts();
    }
    
    render() {
        return(
            <div className="content-container">
            <div className="products-navigation-header">
                <a href={"/admin/produkty/dodaj"}><button className="panel-button">+ dodaj produkt</button></a>
                <div className="ui icon input">
                    <input type="text" placeholder="Szukaj..."/>
                    <i className="search icon"></i>
                </div>            </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr><th>Produkt</th>
            <th>Magazyn</th>
            <th>Cena</th>
            <th>Akcje</th>
            </tr></thead>
            <tbody>
            <ProductsTable products={this.props.products}/>
            </tbody>
            </table>
            </div>            
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { products: state.products, product: state.product };
};
export default connect(
    mapStateToProps,
    { getProducts, deleteProduct, getProduct }
)(Products);