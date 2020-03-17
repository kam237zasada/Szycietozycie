import React from 'react';
import { connect } from 'react-redux';
import { addProduct, getCategories, checkId } from '../../actions';
import { Redirect } from 'react-router-dom';

export function Option ({category}) {

    return (
        <option value={category._id}>{category.name}</option>
    )
}

class NewProductForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            categoryId: '',
            color: '',
            productCode:'',
            description: '',
            numberInStock: '',
            price:'',
            isAdded: false
        }
    }

    async componentDidMount() {
        await this.props.getCategories();
    }
    handleChange = event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            case 'category':
                this.setState({ categoryId: event.target.value });
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

    handleSubmit = async event => {
        event.preventDefault();
        const {name, categoryId, color, description, productCode, numberInStock, price} = this.state;
        await this.props.addProduct(name, categoryId, color, description, productCode, numberInStock, price);
        this.setState({isAdded: true});
    }

    getCategories() {
        return this.props.categories.map( category => <Option category={category} key={category._id}/>)
    }
    render() {
                   
 
        const renderForm = (
            <div className="ui form">
                <form id="addProduct">
                    <label>Dodaj nowy produkt:</label>
                    <div className="panel-form-container"><div className="panel-form-header">Dane podstawowe:</div><div className="field">
                        <label>Nazwa</label>
                        <input
                        type="text"
                        name="name"
                        placeholder=""
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Kategoria</label>
                        <select 
                        name="category" 
                        onChange={this.handleChange} 
                        required
                        >
                        <option value="">Wybierz kategorię</option>
                        {this.getCategories()}
                        </select>
                    </div>
                    <div className="field">
                        <label>Kolor</label>
                        <input
                        type="text"
                        name="color"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Kod produktu</label>
                        <input
                        type="text"
                        name="productCode"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Cena</label>
                        <input
                        type="text"
                        name="price"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Stan magazynowy</label>
                        <input
                        type="text"
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
                        name="description"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <button className="panel-button" form="addProduct" onClick={this.handleSubmit}>Dodaj</button>
                </form>
            </div>
        )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/produkty"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { product: state.product, categories: state.categories };

};

export default connect(
    mapStateToProps,
    { addProduct, getCategories }
    )(NewProductForm);