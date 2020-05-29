import React from 'react';
import { getProduct, getCategory, getCategories, updateProduct, deleteProduct } from '../../actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import apis from '../../api/index';



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
            file: null,
            numberInStock: '',
            price:'',
            changedPrice: '',
            error: '',
            productImage: '',
            loaded: false,
            isUpdated: false,
            isDeleted: false,
            categories: []
        }
    }

    componentDidMount = async () => {
        await this.props.getProduct(this.props.match.params.id);
        await this.setState({categoryId: this.props.product.category._id});
        await this.props.getCategory(this.props.product.category.ID);
        await this.props.getCategories();
        this.setState({categories: this.props.categories});
        this.setState({loaded: true});
        this.setState({_id: this.props.product._id})
        this.setState({name:this.props.product.name})
        this.setState({category: this.props.category.name})
        this.setState({color:this.props.product.color})
        this.setState({productCode:this.props.product.productCode})
        this.setState({description:this.props.product.description})
        this.setState({numberInStock:this.props.product.numberInStock})
        this.setState({price:this.props.product.price})
        this.setState({changedPrice: this.props.product.price});
        this.setState({productImage:this.props.product.productImage})

    }

     handleChange = async event => {
        switch (event.target.name) {
            case 'name':
               this.setState({ name: event.target.value });
                break;
            case 'category':
                await this.setState({ categoryId: event.target.value });
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
                const price = event.target.value;
                let newPrice = price.replace(",", ".");
                await this.setState({ price: newPrice });
                let changedPrice = this.state.price;
                let priceLength = changedPrice.length;
                if (priceLength > 0) {
                if (changedPrice.charAt(changedPrice.length-1) == ".") { changedPrice = `${changedPrice}00`; }
                this.setState({changedPrice: changedPrice});
                }
                break;
            case 'productImage':
                this.setState({file: event.target.files[0]});
                this.setState({productImage: this.state.imagePreview});
                break;
            default:
                break;
        }
    };
    getCategories = () => {

        return this.props.categories.map(category => {
            if(this.state.categoryId===category._id) {
            return <option value={category._id} selected>{category.name}</option>} 
            else {
            return <option value={category._id}>{category.name}</option>
        }}
        )
    }
    handleDelete = async e => {
        e.preventDefault();
        await this.props.deleteProduct(this.state._id);
        this.setState({isDeleted: true});
    }
    handleUpdate = async e => {
        e.preventDefault();
        try { const {_id, name, categoryId, color, description, productCode, numberInStock, changedPrice, productImage} = this.state;
        await this.props.updateProduct(_id, name, categoryId, color, description, productCode, numberInStock, changedPrice, productImage);
        this.setState({isUpdated: true});
        } catch (error) {
            this.setState({error: error.response.data});
        }
    }
    handleFileUpload = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('productImage', this.state.file)
        try {
            const res = await apis.post('/product/uploads', formData, {
                headers: {
                    'Content-type': 'multipart/form-data'
                }
            });
            const { filePath} = res.data;

            this.setState({imagePreview: filePath})
            this.setState({productImage: filePath});

        } catch (err) {
            if(err.response.status === 500) {
                console.log('Pojawił się problem z serwerem')
            }
        }
    }
    
    render() {
        const { name, category, categoryId, color, description, productCode, numberInStock, price, productImage } = this.state;
        
        const loading = (
            <div>...Wczytuję dane...</div>
        )
        
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
                            {/* <option value={categoryId}>{category}</option> */}
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
                    <form onSubmit={this.handleFileUpload}><div className="panel-form-container"><div className="panel-form-header">Zdjęcie:</div>
                    <div className="field">
                        <label>Zdjęcie</label>
                        <img className="upload-image" src={productImage}/>
                        <input
                        type="file"
                        name="productImage"
                        onChange={this.handleChange}
                        required></input>
                    <button type="submit">Dodaj</button>
                    </div>
                    </div>
                    </form>
                    <label className="error-message">{this.state.error}</label>
                    <button className="panel-button" form="editProduct" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" onClick={this.handleDelete}>USUŃ</button>
                </form>
            </div>
        )
        const isLoading = (
            <div>{this.state.loaded  ? renderForm : loading}</div>
        )
        return <div>
            {this.state.isUpdated || this.state.isDeleted ? <Redirect push to="/admin/produkty"/> : isLoading}
        </div>

    }
}

const mapStateToProps = state => {
    return { product: state.product, category: state.category, categories: state.categories };
};
export default connect(
    mapStateToProps,
    { getProduct, getCategory, getCategories, updateProduct, deleteProduct }
)(UpdateProductForm);