import React from 'react';
import { connect } from 'react-redux';
import { addProduct, getCategories, getNewCode } from '../../actions';
import { Redirect } from 'react-router-dom';
import apis from '../../api/index';


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
            file: null,
            fileName: "Wybierz zdjęcie",
            uploadedFile: {},
            imagePreview: '',
            productImage: '',
            error: '',
            isAdded: false
        }
    }

    async componentDidMount() {
        await this.props.getCategories();
        await this.props.getNewCode();
        this.setState({productCode: this.props.code})
    }
    handleChange = event => {
        switch (event.target.name) {
            case 'name':
                console.log(event.target.value)
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
                const price = event.target.value;
                let newPrice = price.replace(",", ".");
                let priceLength = newPrice.length;
                if (priceLength > 0) {
                if (newPrice.charAt(newPrice.length-1) == ".") { newPrice = `${newPrice}00`; }
                }
                console.log("po" + newPrice)
                this.setState({ price: newPrice });
                break;
            case 'productImage':
                this.setState({file: event.target.files[0]});
                this.setState({productImage: this.state.imagePreview});
                break;
            default:
                break;
        }
    };

    handleSubmit = async event => {
        event.preventDefault();
        try { 
            const {name, categoryId, color, description, productCode, numberInStock, price, productImage} = this.state;
        await this.props.addProduct(name, categoryId, color, description, productCode, numberInStock, price, productImage);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data});
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
    

    getCategories() {
        return this.props.categories.map( category => <Option category={category} key={category._id}/>)
    }
    render() {
 
        const renderForm = (
            <div className="ui form">
                <form id="addProduct" enctype="multipart/form-data">
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
                        value={this.state.productCode}
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
                    <form onSubmit={this.handleFileUpload}><div className="panel-form-container"><div className="panel-form-header">Zdjęcie:</div>
                    <div className="field">
                        <label>Zdjęcie</label>
                        <img className="upload-image" src={this.state.imagePreview}/>
                        <input
                        type="file"
                        name="productImage"
                        onChange={this.handleChange}></input>
                    <label htmlFor="productImage">{this.state.fileName}{this.state.uploadedFile.filePath}</label>

                    <button type="submit">Dodaj</button>
                    </div>
                    </div>
                    </form>
                    <label class="error-message">{this.state.error}</label>
                    <button className="panel-button" form="addProduct" onClick={this.handleSubmit}>Dodaj</button>
                </form>
            </div>
        )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/produkty"/> : renderForm}</div>

    }
}

const mapStateToProps = (state) => {
    return { product: state.product, categories: state.categories, code: state.code };

};

export default connect(
    mapStateToProps,
    { addProduct, getCategories, getNewCode }
    )(NewProductForm);