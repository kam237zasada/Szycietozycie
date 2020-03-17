import React from 'react';
import { getProduct, getCategory, getCategories, updateProduct, deleteProduct } from '../../actions';
import { connect } from 'react-redux';
import { Option } from './NewProductForm';
import { Redirect } from 'react-router-dom';

class UpdateProductForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            category: '',
            categoryId: '',
            color: '',
            productCode:'',
            description: '',
            numberInStock: '',
            price:'',
            isUpdated: false,
            isDeleted: false
        }
    }

    componentDidMount = async () => {
        await this.props.getProduct(this.props.match.params.id);
        this.setState({_id: this.props.product._id})
        this.setState({name:this.props.product.name})
        this.setState({categoryId: this.props.product.category._id});
        await this.props.getCategory(this.state.categoryId);
        this.setState({category: this.props.category.name})
        this.setState({color:this.props.product.color})
        this.setState({productCode:this.props.product.productCode})
        this.setState({description:this.props.product.description})
        this.setState({numberInStock:this.props.product.numberInStock})
        this.setState({price:this.props.product.price})
        await this.props.getCategories();

    }

     handleChange = event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            case 'category':
                this.setState({ category: event.target.value });
                break;
            case 'color':
                this.setState({ color: event.target.value });
                break;
            case 'description':
                this.setState({ description: event.target.value });
                break;
            case 'productCode':
                this.setState({ productCode: event.target.value });
                break;
            case 'numberInStock':
                this.setState({ numberInStock: event.target.value });
                break;
            case 'price':
                this.setState({ price: event.target.value });
                break;
            default:
                break;
        }
    };
    getCategories() {
        return this.props.categories.map( category => <Option category={category} key={category._id}/>)
    }
    handleDelete = async e => {
        e.preventDefault();
        await this.props.deleteProduct(this.state._id);
        this.setState({isDeleted: true});
    }
    handleUpdate = async e => {
        e.preventDefault();
        const {_id, name, categoryId, color, description, productCode, numberInStock, price} = this.state;
        await this.props.updateProduct(_id, name, categoryId, color, description, productCode, numberInStock, price);
        this.setState({isUpdated: true});
    }
    
    render() {
        const { name, category, categoryId, color, description, productCode, numberInStock, price } = this.state;

        const renderForm = (
            <div className="ui form">
                <form id="editProduct">
                    <label>Edytuj produkt:</label>
                    <div className="panel-form-container"><div className="panel-form-header">Dane podstawowe:</div><div className="field">
                        <label>Nazwa</label>
                        <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Kategoria</label>
                        <select
                        name="category" 
                        onChange={this.handleChange} 
                        required>
                            <option value={categoryId}>{category}</option>
                        {this.getCategories()}
                        </select>
                    </div>
                    <div className="field">
                        <label>Kolor</label>
                        <input
                        type="text"
                        value={color}
                        name="color"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Kod produktu</label>
                        <input
                        type="text"
                        value={productCode}
                        name="productCode"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Cena</label>
                        <input
                        type="text"
                        value={price}
                        name="price"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Stan magazynowy</label>
                        <input
                        type="text"
                        value={numberInStock}
                        name="numberInStock"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <div className="panel-form-container"><div className="panel-form-header">Opis:</div>
                    <div className="field">
                        <label>Opis</label>
                        <input
                        type="text"
                        value={description}
                        name="description"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <button className="panel-button" form="editProduct" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" onClick={this.handleDelete}>USUŃ</button>
                </form>
            </div>
        )
        return <div>{this.state.isUpdated || this.state.isDeleted ? <Redirect push to="/admin/produkty"/> : renderForm}</div>

    }
}

const mapStateToProps = state => {
    return { product: state.product, category: state.category, categories: state.categories };
};
export default connect(
    mapStateToProps,
    { getProduct, getCategory, getCategories, updateProduct, deleteProduct }
)(UpdateProductForm);