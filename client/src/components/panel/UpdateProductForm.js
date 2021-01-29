import React from 'react';
import ContentEditable from 'react-contenteditable'
import { getProduct, getCategory, getCategories, updateProduct, deleteProduct } from '../../actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import apis from '../../api/index';



class UpdateProductForm extends React.Component {
    constructor(props) {
        super(props)
        this.contentEditable = React.createRef();
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
            productImage: [],
            imagePreview: [],
            loaded: false,
            isUpdated: false,
            isDeleted: false,
            categories: []
        }
    }

    async componentDidMount()  {
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
        this.setState({description: this.props.product.description});
        this.setState({numberInStock:this.props.product.numberInStock})
        this.setState({price:this.props.product.price})
        this.setState({changedPrice: this.props.product.price});
        this.setState({productImage: this.props.product.productImage});
    }

    

    executeCmdWithArg = (event) => {
        event.preventDefault();
        if(event.target.id==="createLink") {
            let URL = window.prompt("Proszę podać adres URL do linku", "http://przykładowyadres.pl")
            document.execCommand(event.target.id, false, URL)

        }
        document.execCommand(event.target.id, false, event.target.value)
    }

    executeCmd = (event) => {
        event.preventDefault();
        document.execCommand(event.target.id, false, null)
    }


    handleChangeDescription = event => {
        this.setState({description: event.target.value})
    }

    handleChange = async event => {
        this.setState({error: ''})
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
            let productImage = this.state.productImage;
            productImage.push(filePath)
            this.setState({productImage: productImage});

        } catch (err) {
            if(err.response.status === 500) {
                this.setState({error: 'Pojawił się problem z serwerem'})
            }
        }
    }
    componentDidUpdate = () => {
        if(this.state.renderSite) {
            this.renderImages();
            this.setState({renderSite: false});
        }
    }

    handleDeleteFile = e => {
        e.preventDefault();
        const index = this.state.productImage.indexOf(e.target.name);
        this.state.productImage.splice(index, 1);
        this.state.imagePreview.splice(index, 1);
        this.setState({renderSite: true})
    }

    renderImages() {
        return this.state.productImage.map(image => {
            return <div className="image-preview-container"><img className="upload-image" src={image}/><button className="close-image-preview" name={image} onClick={this.handleDeleteFile}>X</button></div>

        })
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
                    
                    <div className="text-editor-container">
                    <div className="text-editor-header">
                    <i id="bold" onClick={this.executeCmd} className="fas fa-bold description-icon"></i>
                    <i id="italic" onClick={this.executeCmd} className="fas fa-italic description-icon"></i>
                    <i id="underline" onClick={this.executeCmd} className="fas fa-underline description-icon"></i>
                    <i id="justifyLeft" onClick={this.executeCmd} className="fas fa-align-left description-icon"></i>
                    <i id="justifyCenter" onClick={this.executeCmd} className="fas fa-align-center description-icon"></i>
                    <i id="justifyRight" onClick={this.executeCmd} className="fas fa-align-right description-icon"></i>
                    <i id="justifyFull" onClick={this.executeCmd} className="fas fa-align-justify description-icon"></i>
                    <i id="strikethrough" onClick={this.executeCmd} className="fas fa-strikethrough description-icon"></i>
                    <i id="createLink" onClick={this.executeCmdWithArg} className="fas fa-link description-icon"></i>
                    <i id="subscript" onClick={this.executeCmd} className="fas fa-subscript description-icon"></i>
                    <i id="superscript" onClick={this.executeCmd} className="fas fa-superscript description-icon"></i>
                    <i id="undo" onClick={this.executeCmd} className="fas fa-undo description-icon"></i>
                    <i id="redo" onClick={this.executeCmd} className="fas fa-redo description-icon"></i>
                    <i id="insertUnorderedList" onClick={this.executeCmd} className="fas fa-list-ul description-icon"></i>
                    <i id="insertOrderedList" onClick={this.executeCmd} className="fas fa-list-ol description-icon"></i>
                    <i id="insertParagraph" onClick={this.executeCmd} className="fas fa-paragraph description-icon"></i>
                    Kolor tekstu: <input id="foreColor" type="color" onChange={this.executeCmdWithArg}/>
                    <select id="fontSize" onChange={this.executeCmdWithArg}>
                        <option value="" selected disabled hidden>Wielkość czcionki</option>
                        <option value="1">8</option>
                        <option value="2">10</option>
                        <option value="3">12</option>
                        <option value="4">14</option>
                        <option value="5">18</option>
                        <option value="6">24</option>
                        <option value="7">36</option>
                    </select>
                    <select id="fontName" onChange={this.executeCmdWithArg}>
                        <option value="" selected disabled hidden>Krój czcionki</option>
                        <option style={{fontFamily:'Arial'}} value="Arial">Arial</option>
                        <option style={{fontFamily:'Comic Sans MS'}} value="Comic Sans MS">Comic Sans</option>
                        <option style={{fontFamily:'Courier New'}} value="Courier New">Courier New</option>
                        <option style={{fontFamily:'Georgia'}} value="Georgia">Georgia</option>
                        <option style={{fontFamily:'Helvetica'}} value="Helvetica">Helvetica</option>
                        <option style={{fontFamily:'Times New Roman'}} value="Times New Roman">Times New Roman</option>
                        <option style={{fontFamily:'Verdana'}} value="Verdana">Verdana</option>
                    </select>
                    </div>
                    <ContentEditable
                        className="description-frame"
                        innerRef={this.contentEditable}
                        id="descriptionFrame"
                        name="description"
                        html={this.state.description}
                        disabled={false}
                        onChange={this.handleChangeDescription}
                        tagName=''
                    />                    
                    </div>
                    </div>
                    <form onSubmit={this.handleFileUpload}><div className="panel-form-container"><div className="panel-form-header">Zdjęcie:</div>
                    <div className="field">
                        <div className="images-preview">
                            {this.renderImages()}
                        </div>
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