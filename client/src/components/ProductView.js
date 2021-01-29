import React from 'react';
import ShopMenu from './ShopMenu';
import NavigationLine from './NavigationLine';
import { getProduct, addBasket, updateBasket, productQuestion, addView } from '../actions';
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
            currentImage: '',
            productImage: [],
            shipmentTime:'',
            colors: [],
            color: '',
            variantName: '',
            variantValues: [],
            variantValue: '', 
            tags: [],
            loaded: false,
            error: '',
            available: false,
            amount: 1,
            noInStock:'',
            renderSite: false,
            loaded: false,
            messageError: '',
            firstToRender: 0,
            email: '',
            message: ''
        }
    }

    componentDidMount = async () => {
        try {
            await this.props.getProduct(this.props.match.params.id);
            await this.props.addView(this.props.match.params.id)
        } catch (err) {
            return this.setState({error: err.response.data});
        }
        this.setState({variantValues: this.props.product.variant.values});
        this.setState({variantName: this.props.product.variant.name})
        this.setState({loaded: true})
        this.setState({_id: this.props.product._id});
        this.setState({productImage: this.props.product.productImage})
        this.setState({currentImage: this.state.productImage[0]});
        this.setState({name: this.props.product.name})
        let price = changeView(this.props.product.price);
        this.setState({price: price})
        let description = document.getElementById("description");
        description.innerHTML = this.props.product.description;
        this.setState({numberInStock: this.props.product.numberInStock})
        this.setState({shipmentTime: this.props.product.shipmentTime})
        this.setState({productCode: this.props.product.productCode})
        this.setState({colors: this.props.product.color})
        this.setState({variant: this.props.product.variant})
        this.setState({tags: this.props.product.tags.toString()});
        this.setState({shortDescription: this.props.product.shortDescription});
        if(this.state.shortDecsription=='') { this.setState({shortDesccription: "Szycie to życie, modne torebki damskie, torebki z ekoskóry, worki, organizery."})}
        if(this.state.numberInStock > 0) {this.setState({available: true})}
        let head = document.getElementsByTagName("head");
        let keywords = document.createElement("meta");
        keywords.setAttribute("name", "keywords")
        keywords.setAttribute("content", this.state.tags);
        let shortDescription = document.createElement("meta");
        shortDescription.setAttribute("name", "description");
        shortDescription.setAttribute("content", this.state.shortDescription);
        head[0].appendChild(keywords)
        head[0].appendChild(shortDescription)

        let title = document.getElementsByTagName("title");
        title[0].innerHTML = this.state.name;

    }

    handleChange = event => {
        switch (event.target.name) {
            case 'amount':
                this.setState({ amount: event.target.value });
                this.setState({productError: ''})
                break;
            case 'email':
                this.setState({ email: event.target.value});
                break;
            case 'message':
                this.setState({ message: event.target.value});
                break;
            case 'color':
                this.setState({color: event.target.value});
                break;
            case 'variant':
                this.setState({variantValue: event.target.value});
                this.setState({productError: ''})
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
        this.setState({productError: ''})

        if(this.state.colors.length > 0 && this.state.color==='') {
            return this.setState({productError: "Musisz wybrać kolor produktu!"})
        }
        if(this.state.variantValues.length > 0 && this.state.variantValue==='') {
            return this.setState({productError: "Musisz wybrać wariant produktu!"})
        }
        try {
        let basketId = getCookie("basketId");
        if(!basketId || basketId==="") {
            await this.props.addBasket(this.state._id, this.state.variantName, this.state.variantValue, this.state.color, this.state.amount)
        } else {
            await this.props.updateBasket(basketId, this.state._id, this.state.amount, "insertion", this.state.color, this.state.variantName, this.state.variantValue)
        }}
        catch(err) {
            return this.setState({productError: err.response.data});
        }
        let root = document.getElementById("root");
        let mask = document.createElement("div");
        mask.setAttribute("id", "mask");
        root.after(mask);
        let basketForm = document.createElement("div");
        basketForm.setAttribute("class", "basket-form-container");
        basketForm.setAttribute("id", "basket-form");
        let message = document.createElement("div");
        message.setAttribute("class", "basket-form-message")
        message.innerText="Produkt prawidłowo dodany do koszyka";
        basketForm.appendChild(message);
        let buttonContainer = document.createElement("div");
        buttonContainer.setAttribute("class", "basket-form-button-container");
        basketForm.appendChild(buttonContainer);
        let link = document.createElement("a");
        link.setAttribute("href", "/sklep/b/basket");
        let buttonReturn = document.createElement("button")
        let buttonBasket = document.createElement("button")
        buttonReturn.setAttribute("class", "button-basket");
        buttonBasket.setAttribute("class", "button-basket");
        buttonReturn.innerText = "WRÓĆ NA ZAKUPY";
        buttonBasket.innerText = "PRZEJDŹ DO KOSZYKA";
        buttonReturn.addEventListener("click", this.handleCloseBasketForm)
        buttonContainer.appendChild(buttonReturn);
        buttonContainer.appendChild(link);
        link.appendChild(buttonBasket);

        root.after(basketForm);

    }

    handleCloseBasketForm = () => {
        let basketForm = document.getElementById("basket-form")
        basketForm.remove();
        let mask = document.getElementById("mask");
        mask.remove();   
    }

    handleCloseQuestionForm = () => {
        let formContainer = document.getElementById("question-form")
        formContainer.remove();
        let mask = document.getElementById("mask");
        mask.remove();   
    }

    handleQuestion = async e => {
        e.preventDefault();
        this.setState({messageError: ""})
        if(this.state.email=="") {
            this.setState({messageError: "Musisz podać Twój adres mailowy!"})
            let p = document.getElementById("messageError");
            return p.innerText = this.state.messageError;

        }
        if(this.state.message=="") {
            this.setState({messageError: "Wysyłana wiadomość nie może być pusta!"})
            let p = document.getElementById("messageError");
            return p.innerText = this.state.messageError;
        }


        const data = {
            link: window.location.href,
            productName: this.state.name,
            message: this.state.message,
            email: this.state.email
        }
        try {
        await this.props.productQuestion(this.state.email, data);
        } catch (err) {
            this.setState({messageError: err.response.data})
            let p = document.getElementById("messageError");
            return p.innerText = this.state.messageError;
        }
        let formContainer = document.getElementById("question-form")
        formContainer.remove();
        let mask = document.getElementById("mask");
        let message = document.createElement("div");
        message.setAttribute("class", "question-response")
        message.innerText = this.props.mail;
        mask.after(message);
        setTimeout(function() {
            message.remove();
            mask.remove();
        }, 2000)    
    }

    askQuestion = async e => {
        e.preventDefault();
        this.setState({messageError: ""})
        let root = document.getElementById("root");
        let mask = document.createElement("div");
        mask.setAttribute("id", "mask");
        root.after(mask);
        let formContainer = document.createElement("div")
        formContainer.setAttribute("class", "question-form-container")
        formContainer.setAttribute("id", "question-form")
        let formHeader = document.createElement("div")
        formHeader.setAttribute("class", "question-form-header")
        formHeader.innerText="Zadaj Pytanie"
        formContainer.appendChild(formHeader);
        let handleClose = document.createElement('button');
        handleClose.setAttribute("class", "question-form-close")
        handleClose.innerHTML="zamknij <b>x</b>";
        handleClose.addEventListener("click", this.handleCloseQuestionForm)
        formHeader.appendChild(handleClose);
        let formContent = document.createElement("div")
        formContent.setAttribute("class", "question-form-content")
        formContainer.appendChild(formContent);
        let email = document.createElement('input');
        email.setAttribute("class", "question-form-email")
        email.setAttribute("type", "email")
        email.setAttribute("name", "email")
        email.setAttribute("placeholder", "Podaj Twój adres e-mail")
        email.setAttribute("value", this.state.email);
        email.setAttribute("required", "true")
        email.addEventListener("change", this.handleChange)
        formContent.appendChild(email)
        let message = document.createElement('textarea');
        message.setAttribute("class", "question-form-message")
        message.setAttribute("rows", "6")
        message.setAttribute("cols", "70")
        message.setAttribute("name", "message")
        message.setAttribute("placeholder", "Twoje pytanie...")
        message.setAttribute("value", this.state.message)
        message.setAttribute("required", "true")
        message.addEventListener("change", this.handleChange)
        formContent.appendChild(message)
        let button = document.createElement("button");
        button.setAttribute("class", "button-basket")
        button.addEventListener("click", this.handleQuestion)
        button.innerHTML="Wyślij";
        formContent.appendChild(button);
        let p = document.createElement("p");
        p.setAttribute("id", "messageError")
        formContent.appendChild(p);

        root.after(formContainer);
    }

    handleImageChange = e => {
        e.preventDefault();
        this.setState({currentImage: e.target.src});
        this.setState({currentIndex: e.target.attributes.index.value})
    }

    handleBack = e => {
        e.preventDefault();
            let firstToRender = this.state.firstToRender -1
            this.setState({firstToRender: firstToRender})
    }

    handleNext = e => {
        e.preventDefault();
            let firstToRender = this.state.firstToRender +1
            this.setState({firstToRender: firstToRender})
    }

    renderImages() {
        return this.state.productImage.map((image, index) => {
            let lastToRender = this.state.firstToRender + 3
            if(this.state.productImage.length>4) {
                if(index <= lastToRender && index >= this.state.firstToRender) {
                    if(index===this.state.firstToRender && index!=0) {
                        if(index===this.state.currentIndex) {
                            return <><button className="arrow" onClick={this.handleBack}><i className="fa fa-chevron-left"></i></button><button id={image} index={index} style={{border: "2px solid green"}}className="shop-product-image"><img index={index} src={image} onClick={this.handleImageChange} alt="miniaturka zdjęcia"></img></button></>
            
                        } else {
                        return <><button className="arrow" onClick={this.handleBack}><i className="fa fa-chevron-left"></i></button><button id={image} index={index}className="shop-product-image"><img index={index} src={image} onClick={this.handleImageChange} alt="miniaturka zdjęcia"></img></button></>
                        }
                    } else if(index===lastToRender && index!=this.state.productImage.length-1) {
                        if(index===this.state.currentIndex) {
                            return <><button id={image} index={index} style={{border: "2px solid green"}}className="shop-product-image"><img index={index} src={image} onClick={this.handleImageChange} alt="miniaturka zdjęcia"></img></button><button className="arrow" onClick={this.handleNext}><i className="fa fa-chevron-right"></i></button></>
            
                        } else {
                        return <><button id={image} index={index}className="shop-product-image"><img index={index} src={image} onClick={this.handleImageChange} alt="miniaturka zdjęcia"></img></button><button className="arrow"  onClick={this.handleNext}><i className="fa fa-chevron-right"></i></button></>
                        }
                    }
                    else {
                        if(index==this.state.currentIndex) {
                            return <><button id={image} index={index} style={{border: "2px solid green"}}className="shop-product-image"><img index={index} src={image} onClick={this.handleImageChange} alt="miniaturka zdjęcia"></img></button></>
            
                        } else {
                        return <><button id={image} index={index}className="shop-product-image"><img index={index} src={image} onClick={this.handleImageChange} alt="miniaturka zdjęcia"></img></button></>
                        }  
                    }
                
            }
        } else {
            return <button id={image} index={index}className="shop-product-image"><img index={index} src={image} onClick={this.handleImageChange} alt="miniaturka zdjęcia"></img></button>
        }
            
        })
    }

    renderColors() {
        return this.state.colors.map(element => {
            return <option value={element.id}>{element.name}</option>
        })
    }

    renderVariant() {
        return this.state.variantValues.map(element => {
            return <option value={element}>{element}</option>
        })
    }

    handleCloseBiggerPhoto = () => {
        let formContainer = document.getElementById("question-form")
        formContainer.remove();
        let mask = document.getElementById("mask");
        mask.remove();   
    }

    handleBiggerPhoto = () => {
        let root = document.getElementById("root");
        let mask = document.createElement("div");
        mask.setAttribute("id", "mask");
        root.after(mask);
        let div = document.createElement("div");
        div.setAttribute("class", "bigger-photo-container")
        div.setAttribute("id", "question-form")
        div.addEventListener("click", this.handleCloseBiggerPhoto)
        let img = document.createElement("img");
        img.setAttribute("src", this.state.currentImage);
        img.setAttribute("class", "big-photo")
        div.appendChild(img)
        let handleClose = document.createElement('button');
        handleClose.setAttribute("class", "question-form-close")
        handleClose.innerHTML="zamknij <b>x</b>";
        img.appendChild(handleClose)
        root.after(div)
    }


    render() {
        const available = (
            <div className="available">Produkt dostępny!</div>
        )

        const unavailable =(
            <div className="unavailable">Produkt niedostepny!</div>
        )

        const basket = (
            <div className="species-basket"><div><span style={{color: 'red'}}>{this.state.productError}</span></div>
                <input className="button-basket" type="button" value="DODAJ DO KOSZYKA" onClick={this.addToBasket}/></div>
        )

        const checkAvailability = (
            <div className="species-basket"><button className="button-disabled" value="DODAJ DO KOSZYKA" disabled>DODAJ DO KOSZYKA</button></div>
        )
        
        const renderProduct = (
            <div className="product-view-container">
            <div className="product-view-content">
                <div className="product-view-name"><h2>{this.state.name}</h2></div>
                <div className="product-view-image">
                    <div className="main-image">
                        <img onClick={this.handleBiggerPhoto} src={this.state.currentImage} alt={this.state.name}/>
                    </div>
                    <div className="shop-preview-images-container">
                        {this.renderImages()}
                    </div>
                </div>
                <div className="product-view-species">
                    <div className="species-price">{this.state.price} zł</div>
                    <div className="species-shipment">Czas wysyłki: {this.state.shipmentTime}</div>
                    {this.state.colors.length===0 ? null : <div className="species-color">Wybierz Kolor: <select onChange={this.handleChange} name="color">
                        <option onChange={this.handleChange}value="">Wybierz z listy</option>
                        {this.renderColors()}
                        </select></div>}
                    {this.state.variantValues.length===0 ? null : <div className="species-color">{this.state.variantName}: <select onChange={this.handleChange} name="variant">
                        <option value="">Wybierz z listy</option>
                        {this.renderVariant()}
                        </select></div>}
                    <div className="species-availability">{this.state.available ? available : unavailable}</div>
                    {this.howMany()}
                    { this.state.available ? <div className="species-amount"><input className="button-amount" type="button" value="-" onClick={this.handleSubstract}/><input className="input-amount" type="text" value={this.state.amount} name="amount" onChange={this.handleChange}/><input className="button-amount" type="button" value="+" onClick={this.handleAdd}/></div> : null}
                    { this.state.available ? basket : checkAvailability}
                    <div className="species-productCode">Kod produktu: {this.state.productCode}</div>
                    <div><button onClick={this.askQuestion} className="button-basket">Zadaj pytanie</button></div>
                    </div>
            </div>
            <div className="product-view-description">
                <h2 className="description-header">Opis:</h2>
                <div id="description">
                    </div>
            </div>
            </div>
        )
        const isError = (

            <>{this.state.error==="" ? <><NavigationLine category={this.props.product.category} product={this.props.product}/><div className="shop-content"><ShopMenu/>{renderProduct}</div></> : <div>{this.state.error}, wróć na <a href="/sklep">Stronę główną</a> sklepu</div>}</>
        )

        const loading = (
            <div>...Wczytuję stronę...</div>
        )

        return(
            
            
            <>
                {this.state.loaded ? isError : loading}
            </>
        )
    }
}

const mapStateToProps = state => {
    return { product: state.product, basket: state.basket, mail:state.mail };
};
export default connect(
    mapStateToProps,
    { getProduct, addBasket, updateBasket, productQuestion, addView }
)(ProductView);