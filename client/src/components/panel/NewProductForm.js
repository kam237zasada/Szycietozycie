import React from 'react';
import ContentEditable from 'react-contenteditable'
import { connect } from 'react-redux';
import { addProduct, getCategories, getProduct, updateProduct, deleteProduct, getNewCode, getVariants, getColors } from '../../actions';
import { Redirect } from 'react-router-dom';
import apis from '../../api/index';
import { deleteWhiteSpaces, getCookie, getDate } from '../../js/index';


export function Option ({value}) {

    return (
        <option value={value._id}>{value.name}</option>
    )
}

class NewProductForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            categoryId: '',
            color: [],
            productCode:'',
            description: '',
            numberInStock: '',
            shipmentTime: '',
            price:'',
            file: null,
            fileName: "Wybierz zdjęcie",
            uploadedFile: {},
            imagePreview: [],
            productImage: [],
            error: '',
            isAdded: false,
            renderSite: false,
            variants: [],
            tags: '',
            alternatives: '',
            variantId:'', 
            colors: [],
            product: {},
            category: {},
            selectedColors: [],
            update: false,
            loaded: false,
            charLeft: 150,
            shortDescription: '',
            dateAdded: ''
        }
    }

    async componentDidMount() {
        const jwt = getCookie("jwt")
        await this.props.getCategories();
        await this.props.getVariants(jwt);
        this.setState({variants: this.props.variants})
        await this.props.getNewCode();
        this.setState({productCode: this.props.code})
        await this.props.getColors(jwt);
        this.setState({colors: this.props.colors});
        if(this.props.match.params.id!=undefined) {
            await this.props.getProduct(this.props.match.params.id);
            this.setState({_id: this.props.product._id})
            this.setState({price: this.props.product.price});
            this.setState({name: this.props.product.name});
            this.setState({numberInStock: this.props.product.numberInStock});
            this.setState({productCode: this.props.product.productCode})
            this.setState({categoryId: this.props.product.category._id})
            this.setState({color: this.props.product.color});
            this.setState({shipmentTime: this.props.product.shipmentTime})
            this.setState({description: this.props.product.description})
            this.setState({shortDescription: this.props.product.shortDescription})
            let date = new Date(this.props.product.dateAdded);
            let dateString = getDate(date);
            this.setState({dateAdded: "Data dodania: " + dateString})
            this.setState({charLeft: 150 - this.state.shortDescription.length})
            this.setState({productImage: this.props.product.productImage})
            this.setState({variantId: this.props.product.variant._id})
            this.setState({tags: this.props.product.tags.toString()})
            this.setState({alternatives: this.props.product.alternatives.toString()})
            this.setState({update: true})
        }
        this.setState({loaded: true})
        console.log(this.state.dateAdded)
        await this.renderColors();
        await this.checkColors();

        
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
                let color = this.state.color;
                let indexToDelete = -1;
                let array = event.target.value.split("-");
                let id = array[0]
                let name = array[1]
                let toAdd = {
                    _id: id,
                    name: name
                }
                color.map((element, index) => {
                    if(element._id===id) {
                        indexToDelete = index
                    }
                })
                if(indexToDelete > -1) {
                    color.splice(indexToDelete, 1)
                    
                } else {
                    color.push(toAdd);
                }
                this.setState({color: color})
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
                }
                this.setState({ price: newPrice });
                break;
            case 'shipmentTime':
                this.setState({shipmentTime: event.target.value})
                break;
            case 'shortDescription':
                this.setState({shortDescription: event.target.value});
                console.log(event.target)
                this.setState({charLeft: 150-event.target.textLength })
                break;
            case 'productImage':
                this.setState({file: event.target.files[0]});
                break;
            case 'variant':
                this.setState({variantId: event.target.value});
                break;
            case 'tags':
                this.setState({tags: event.target.value});
                break;
            case 'alternatives':
                this.setState({alternatives: event.target.value});
                break;
            default:
                break;
        }
    };

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

    handleDelete = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        await this.props.deleteProduct(this.state._id, jwt);
        this.setState({isAdded: true});
    }
    handleUpdate = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        try { const {_id, name, price, shipmentTime, numberInStock, categoryId, color, shortDescription, description, productCode, productImage, variantId, tags, alternatives} = this.state;
        let tagsArray = tags.split(',');
            tagsArray = tagsArray.map(tag => {
                return deleteWhiteSpaces(tag)
            });
            let alternativesArray = alternatives.split(',');
            alternativesArray = alternativesArray.map(alternative => {
                return deleteWhiteSpaces(alternative)
            })
        await this.props.updateProduct(_id, name, categoryId, color, shortDescription, description, productCode, numberInStock, price, shipmentTime, productImage, variantId, tagsArray, alternativesArray, jwt);
        this.setState({isAdded: true});
        } catch (error) {
            this.setState({error: error.response.data});
        }
    }

    handleSubmit = async event => {


        event.preventDefault();
        const jwt = getCookie("jwt")
        try { 
            const {name, categoryId, color, shortDescription, description, productCode, numberInStock, price, shipmentTime, productImage, variantId, tags, alternatives} = this.state;
            let tagsArray = tags.split(',');
            tagsArray = tagsArray.map(tag => {
                return deleteWhiteSpaces(tag)
            });
            let alternativesArray = alternatives.split(',');
            alternativesArray = alternativesArray.map(alternative => {
                return deleteWhiteSpaces(alternative)
            })

        await this.props.addProduct(name, categoryId, color, shortDescription, description, productCode, numberInStock, price, shipmentTime, productImage, variantId, tagsArray, alternativesArray, jwt);
        this.setState({isAdded: true});
        } catch (err) {
            this.setState({error: err.response.data});
        }
    }

    handleFileUpload = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        const formData = new FormData();
        formData.append('productImage', this.state.file)
        try {
            const res = await apis.post('/product/uploads', formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                    token: jwt
                }
            });
            const { filePath } = res.data;

            let productImage = this.state.productImage;
            productImage.push(filePath)
            this.setState({productImage: productImage});

        } catch (err) {
            if(err.response.status === 500) {
                console.log('Pojawił się problem z serwerem')
            }
        }
    }
    

    getCategories = () => {

        return this.props.categories.map(category => {
            if(this.state.categoryId===category._id) {
            return <option value={category._id} selected>{category.name}</option>} 
            else {
            return <option value={category._id}>{category.name}</option>
        }}
        )
    }

    renderVariants() {
        return this.state.variants.map( variant => {
            if(variant._id===this.state.variantId) {
                return (
                    <option value={variant._id} selected>{variant.name}</option>
                )
            } else {
                return (
                    <option value={variant._id}>{variant.name}</option>                )
            }
    })
    }

    checkColors() {
        let checkboxes = document.getElementsByClassName("color-checkboxes");
        for(let i=0;i<checkboxes.length;i++) {
            for(let z=0; z<this.state.color.length;z++) {
                if(this.state.color[z]._id===checkboxes[i].id) {
                    checkboxes[i].setAttribute("checked", "true");
                }
            }
        }
    }

    renderColors() {
        return this.state.colors.map( color => {
                let container = document.getElementById("color-checkbox-container");
                let label = document.createElement("label");
                label.setAttribute("class", "checkbox-label");
                let input = document.createElement("input");
                input.setAttribute("class", "color-checkboxes");
                input.setAttribute("id", color._id);
                input.setAttribute("type", "checkbox");
                input.setAttribute("name", "color");
                input.value=`${color._id}-${color.name}`;
                input.addEventListener("change", this.handleChange);
                label.appendChild(input);
                let p = document.createElement("p");
                p.innerHTML = color.name
                label.appendChild(p);
                container.appendChild(label)

        }
        )
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

    renderShipTime() {
        let shipments = ["Natychmiast", "24 godziny", "2 dni", "3 dni", "4 dni", "5 dni", "6 dni", "7 dni", "10 dni", "14 dni", "21 dni"]
        return shipments.map(element => {
            if(this.state.shipmentTime===element) {
                return <option value={element} selected>{element}</option>
            } else {
                return <option value={element}>{element}</option>
            }
        })
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
                        value={this.state.name}
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
                    <div className="field" id="color-checkbox-container">
                        <label>Kolor</label>
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
                        value={this.state.price}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Stan magazynowy</label>
                        <input
                        type="text"
                        name="numberInStock"
                        value={this.state.numberInStock}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Czas wysyłki</label>
                        <select name="shipmentTime" onChange={this.handleChange}>
                            <option value="">Wybierz z listy</option>
                            {this.renderShipTime()}
                        </select>
                    </div>
                    </div>
                    <div className="panel-form-container"><div className="panel-form-header">Opis:</div>

                    <div className="field">
                        <label>Krótki opis</label>
                        <textarea
                        name="shortDescription"
                        value={this.state.shortDescription}
                        rows="5"
                        cols="50"
                        maxLength="150"
                        onChange={this.handleChange}></textarea>
                        Zostało znaków: {this.state.charLeft}
                    </div>
                    
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
                    <label><b>Opis główny:</b></label>

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
                    <form onSubmit={this.handleFileUpload} className="dropzone" id="my-awesome-dropzone">
                        <div className="panel-form-container"><div className="panel-form-header">Zdjęcie:</div>
                        <label>Zdjęcie</label>
                        <div className="images-preview">
                        {this.renderImages()}
                        </div>
                        <input
                        type="file"
                        name="productImage"
                        onChange={this.handleChange}></input>

                    <button type="submit">Dodaj</button>
                    </div>
                    </form>

                    <div className="panel-form-container">
                        <div className="panel-form-header">Wariant:</div>
                        <div className="field">
                        <label>Wybierz rodzaj wariantu</label>
                        <select
                        name="variant"
                        onChange={this.handleChange}>
                        <option value="">Brak</option>
                            {this.renderVariants()}
                        </select>
                        </div>
                    </div>

                    <div className="panel-form-container">
                        <div className="panel-form-header">Dodatkowe informacje:</div>
                        <div className="field">
                        <label>Tagi (każdy tag należy oddzielić przecinkiem)</label>
                        <input
                        type="text"
                        value={this.state.tags}
                        onChange={this.handleChange}
                        name="tags"
                        />
                        </div>
                        <div className="field">
                        <label>Frazy alternatywne (pomagają w wyszukiwaniu produktów)</label>
                        <input
                        type="text"
                        value={this.state.alternatives}
                        onChange={this.handleChange}
                        name="alternatives"
                        />
                        </div>
                    </div>
                    <label className="error-message">{this.state.error}</label>
                    {this.state.update ? <><button className="panel-button" form="editProduct" onClick={this.handleUpdate}>Edytuj</button><button className="panel-button" onClick={this.handleDelete}>USUŃ</button></>
 : <button className="panel-button" form="addProduct" onClick={this.handleSubmit}>Dodaj</button>}
                </form>
            </div>
        )

        const loaded = (
        <>{this.state.loaded ? renderForm : <div>Wczytywanie...</div>}</>
        )
        return <div>{this.state.isAdded ? <Redirect push to="/admin/products"/> : loaded}</div>

    }
}

const mapStateToProps = (state) => {
    return { product: state.product, categories: state.categories, code: state.code, variants: state.variants, colors: state.colors };

};

export default connect(
    mapStateToProps,
    { addProduct, getCategories, updateProduct, deleteProduct, getNewCode, getVariants, getColors, getProduct }
    )(NewProductForm);