import React from 'react';
import ShopMenu from './ShopMenu';
import {getBasket, updateBasket, deleteBasket, getShipments, getPayments, addOrder} from '../actions';
import { connect } from 'react-redux';
import {changeView, changeString, deleteCookie, getCookie} from '../js/index';
import { Redirect } from 'react-router-dom';
import { RenderShipments } from './RenderShipments.js';
import { RenderPayments } from './RenderPayments.js';
import { faJournalWhills } from '@fortawesome/free-solid-svg-icons';


class BasketView extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            productId: '',
            name: '',
            productCode: '',
            productImage: '',
            price: '',
            loaded: false,
            error: '',
            empty: true,
            products: [],
            basketId: '',
            howMany: 0,
            cost: 0,
            renderSite: false,
            message: '',
            shipments: [],
            payments: [],
            shipmentCost: 0,
            orderClicked: false,
            clientName: '',
            street: '',
            zipCode: '',
            city: '',
            email: '',
            telephone: '',
            differentAddress: false,
            differentClientName:'',
            differentStreet:'',
            differentZipCode: '',
            differentCity: '',
            differentTelephone: '',
            invoiceCompanyName: '',
            invoiceStreet: '',
            invoiceZipCode: '',
            invoiceCity: '',
            invoiceNIP: '',
            invoice: false,
            identitiesSet: false,
            selectedShipment: null,
            selectedPayment: null,
            paymentError:'',
            shipmentError:'',
            hideBasket: false
        }
    }
    countProducts(products) {
        let sum = 0;
            for (let i=0; i<products.length; i++) {
                sum += products[i].amount;
            }
            return sum
    }

    countOrderCost() {
        let orderCost = this.state.cost + this.state.shipmentCost;
        return orderCost
    }

    async componentDidMount() {
        console.log("abc")
        // let basketId = await localStorage.getItem("basketId")
        let basketId = await getCookie("basketId");
        this.setState({basketId: basketId})
        if(!basketId)  { return this.setState({loaded: true}); };
        await this.props.getPayments();
        this.setState({payments: this.props.payments});
        await this.props.getShipments();
        this.setState({shipments: this.props.shipments});


        try {
            await this.props.getBasket(basketId)
            await this.setState({products: this.props.basket.products})
            this.setState({cost: this.props.basket.cost})
            let sum = this.countProducts(this.state.products);
            this.setState({howMany: sum});
        } catch (err) {
            // localStorage.removeItem("basketId");
            deleteCookie('basketId');
            this.setState({error: err.response.data})
        }
        this.setState({loaded: true});
        this.setState({empty: false});

    }
    componentDidUpdate = async () => {
        if(this.state.renderSite) {
            await this.props.getBasket(this.state.basketId)
            await this.setState({products: this.props.basket.products});
            this.setState({howMany: this.countProducts(this.state.products)})
            this.setState({cost: this.props.basket.cost});
            if (this.props.basket.products.length===0) {
                deleteCookie('basketId');
                await this.props.deleteBasket(this.state.basketId);
                this.setState({empty: true});
            }
            this.setState({renderSite:false});

        }
    }

    handleAddOne = async e => {
        e.preventDefault();
        let element = document.getElementById(e.target.id);
        try {
            await this.props.updateBasket(this.state.basketId, e.target.id, 1, "insertion");
            this.setState({renderSite: true});
            
            this.setState({insertionError:''})
            let isError = document.getElementById("errorSpan");
            if(isError) {
                isError.remove();
            }
        } catch (err) {
            this.setState({insertionError: err.response.data})
            let isError = document.getElementById("errorSpan");
            if(!isError) {
            let newElement = document.createElement("span");
            newElement.style.color = "red";
            newElement.setAttribute("id", "errorSpan");
            newElement.innerText=`${this.state.insertionError}`
            let elementParent = element.parentNode;
            elementParent.insertBefore(newElement, element)
            } else {return null}
        }
    }

    handleDeleteOne = async e => {
        e.preventDefault();
        let isError = document.getElementById("errorSpan");
        if(isError) {
            isError.remove();
        }       
        await this.props.updateBasket(this.state.basketId, e.target.id, 1, "deletion");
        this.setState({renderSite: true});
    }

    handleDeleteProduct = async e => {
        e.preventDefault();
        let isError = document.getElementById("errorSpan");
        if(isError) {
            isError.remove();
        }
        await this.props.updateBasket(this.state.basketId, e.target.id, "all", "deletion");
        this.setState({insertionError:''})
        this.setState({renderSite: true});
    }

    addShipmentCost = (selectedShipment) => {
        this.setState({shipmentCost: selectedShipment.price});
        this.setState({selectedShipment: selectedShipment});
        this.setState({shipmentError: ''})
        this.setState({shipmentName: selectedShipment.name});
        this.setState({shipmentId: selectedShipment._id})
        this.setState({overallCost: this.state.cost + selectedShipment.price});
    }

    addPaymentMethod = (selectedMethod) => {
        this.setState({selectedPayment: selectedMethod});
        console.log(this.state.selectedPayment);
        this.setState({paymentError: ''})
        this.setState({paymentName: selectedMethod.name});
        this.setState({paymentId: selectedMethod._id})

    }

    handleOrderClicked = async e => {
        if(!this.state.selectedShipment && !this.state.selectedPayment) {
            await this.setState({shipmentError: "Musisz wybrać metodę dostawy"});
            await this.setState({paymentError: "Musisz wybrać metodę płatności"});
            return null

        }
        if(!this.state.selectedShipment) {
            return await this.setState({shipmentError: "Musisz wybrać metodę dostawy"})
        }
        if(!this.state.selectedPayment) {
            return await this.setState({paymentError: "Musisz wybrać metodę płatności"})
        }
        this.setState({hideBasket: true});
        this.setState({orderClicked: true});
        let element = document.getElementById('basket-container');
        element.style.display="none"
    }
    handleBack = async e => {
        if(e.target.name==="backToBasket") {
        this.setState({hideBasket: false});
        this.setState({orderClicked: false});
        this.setState({differentAddress: false});
        this.setState({invoice: false});
        let element = document.getElementById('basket-container')
        element.style.display="block";
        } else if(e.target.name==="backToIdentities") {
            this.setState({orderClicked: true})
            this.setState({identitiesSet: false});
        }

    }

    handleShowSummary = e => {
        const regexzipCode = /\b\d{2}-\d{3}\b/
        const regextelephone = /\b\d{9}\b/
        if(this.state.clientName==='' || this.state.email==='' || this.state.telephone==="" || this.state.street==='' | this.state.zipCode==="" || this.state.city==="") {
            return this.setState({showSummaryError: "Wypełnij wszystkie pola z gwiazdką!"});
        } else if(!regextelephone.test(this.state.telephone)) {
            this.setState({showSummaryError: 'Zły numer telefonu'})
            let element = document.getElementById('telephone');
            element.style.backgroundColor="red";
            return null
        } else if(!regexzipCode.test(this.state.zipCode)) {
            this.setState({showSummaryError: 'Błędny format kodu pocztowego, spróbuj 12-345'})
            let element = document.getElementById('zipCode');
            element.style.backgroundColor="red";
            return null
        } else {
            this.setState({showSummaryError:''});
            let elementtel = document.getElementById('telephone');
            let elementzip = document.getElementById('zipCode');
            elementtel.style.backgroundColor="white";
            elementzip.style.backgroundColor="white";
        }
        if(this.state.differentAddress) {
            if(this.state.differentClientName==='' || this.state.differentTelephone==='' || this.state.differentStreet==='' || this.state.differentZipCode==='' || this.state.differentCity==='') {
                return this.setState({showSummaryError: "Wypełnij wszystkie pola z gwiazdką!"})
            } else if(!regextelephone.test(this.state.differentTelephone)) {
                return this.setState({showSummaryError: 'Zły numer telefonu'})
            } else if(!regexzipCode.test(this.state.differentZipCode)) {
                return this.setState({showSummaryError: 'Błędny format kodu pocztowego, spróbuj 12-345'})
            } else {
                this.setState({showSummaryError: ''});
        }
        }
        if(this.state.invoice) {
            if(this.state.invoiceCompanyName==='' || this.state.invoiceStreet==='' || this.state.invoiceZipCode==='' || this.state.invoiceCity==='' || this.state.invoiceNIP==='') {
                return this.setState({showSummaryError: "Wypełnij wszystkie pola z gwiazdką!"})
            } else this.setState({showSummaryError: ''})
        }
        this.setState({orderClicked: false});
        this.setState({identitiesSet: true});
    }

    getProducts = () => {

            return this.state.products.map(product => {
            let newPrice = changeView(product.price);
            let value = product.price * product.amount;
            let newValue = changeView(value);
            let newString = changeString(product.name);
            return (<tr>
            <td data-label="Obraz"><a href={`/sklep/p/${newString}/${product.ID}`}><img style={{width: "80px", height: "auto"}}src={product.productImage}/></a></td>
            <td data-label="Nazwa"><a href={`/sklep/p/${newString}/${product.ID}`}>{product.name}</a></td>
            <td data-label="Ilość"><input onClick={this.handleDeleteOne} id={product._id} className="button-amount minus" type="button" value="-"></input><input className="input-amount" type="text" value={product.amount}></input><input onClick={this.handleAddOne} id={product._id} className="button-amount plus" type="button" value="+"></input> </td>
            <td data-label="Cena">{newPrice}</td>
            <td data-label="Wartość">{newValue}</td>
            <td><input onClick={this.handleDeleteProduct} id={product._id}className="delete-basket" type="button" value="X"></input></td>
        </tr>)}
        )
    }

    getProductsSummary = () => {
        
        return this.state.products.map(product => {
            let newPrice = changeView(product.price);
            let value = product.price * product.amount;
            let newValue = changeView(value);
            let newString = changeString(product.name);
            return (<tr>
            <td data-label="Obraz"><a href={`/sklep/p/${newString}/${product.ID}`}><img style={{width: "80px", height: "auto"}}src={product.productImage}/></a></td>
            <td data-label="Nazwa"><a href={`/sklep/p/${newString}/${product.ID}`}>{product.name}</a></td>
            <td data-label="Ilość"><label>{product.amount}</label></td>
            <td data-label="Cena">{newPrice}</td>
            <td data-label="Wartość">{newValue}</td>
        </tr>)}
        )
    }

    handleTakeOrder = async e => {
        e.preventDefault();
        let shipmentIdentities;
        let customerIdentities = {
            name: this.state.clientName,
            email: this.state.email,
            telephone: this.state.telephone,
            street: this.state.street,
            zipCode: this.state.zipCode,
            city: this.state.city
        }
        if(this.state.differentAddress===true) {
        shipmentIdentities = {
            name: this.state.differentClientName,
            telephone: this.state.differentTelephone,
            street: this.state.differentStreet,
            zipCode: this.state.differentZipCode,
            city: this.state.differentCity        
            }
        } else {
            shipmentIdentities = {
                name: this.state.clientName,
                telephone: this.state.telephone,
                street: this.state.street,
                zipCode: this.state.zipCode,
                city: this.state.city       
            } 
        }

        let invoiceIdentities = {
            companyName: this.state.invoiceCompanyName,
            NIP: this.state.invoiceNIP,
            street: this.state.invoiceStreet,
            zipCode: this.state.invoiceZipCode,
            city: this.state.invoiceCity
        }
        let customer = {
            name: "",
        }
        await this.props.addOrder(customerIdentities, shipmentIdentities, invoiceIdentities, customer, this.state.products, this.state.shipmentId, this.state.paymentId, this.state.overallCost, 1 )
    }
    handleChange = async event => {
        switch (event.target.name) {
            case 'clientName':
               this.setState({ clientName: event.target.value });
                break;
            case 'street':
                await this.setState({ street: event.target.value });
                break;
            case 'zipCode':
                this.setState({ zipCode: event.target.value });
                break;
            case 'city':
                this.setState({ city: event.target.value });
                break;
            case 'telephone':
                this.setState({ telephone: event.target.value });
                break;
            case 'email':
                this.setState({ email: event.target.value });
                break;
            case 'comment':
                this.setState({ comment: event.target.value})
            case 'differentClientName':
               this.setState({ differentClientName: event.target.value });
                break;
            case 'differentStreet':
                await this.setState({ differentStreet: event.target.value });
                break;
            case 'differentZipCode':
                this.setState({ differentZipCode: event.target.value });
                break;
            case 'differentCity':
                this.setState({ differentCity: event.target.value });
                break;
            case 'differentTelephone':
                this.setState({ differentTelephone: event.target.value });
                break;
            case 'invoiceStreet':
                await this.setState({ invoiceStreet: event.target.value });
                break;
            case 'invoiceZipCode':
                this.setState({ invoiceZipCode: event.target.value });
                break;
            case 'invoiceCity':
                this.setState({ invoiceCity: event.target.value });
                break;
            case 'invoiceCompanyName':
                this.setState({ invoiceCompanyName: event.target.value });
                break;
            case 'invoiceNIP':
                this.setState({ invoiceNIP: event.target.value });
                break;
            case 'differentAddress':
                if(this.state.differentAddress===false) {
                    this.setState({ differentAddress: true})
                } else {
                this.setState({ differentAddress: false})
                }
                break;
            case 'invoice':
                if(this.state.invoice===false) {
                    this.setState({ invoice: true})
                } else {
                this.setState({ invoice: false})
                }
                break;
            default:
                break;
        }
    };


    render() {

            let newCost = changeView(this.state.cost);
            let overallCost = this.countOrderCost();
            let newOverallCost = changeView(overallCost);
            let newShipmentCost = changeView(this.state.shipmentCost);

            const invoice = (
                <div className="shop-form ui form">
                <form id="invoiceIdentities">
                    <div className="shop-form-container"><div className="shop-form-header">Dane do faktury:</div><div className="field">
                        <label>*Nazwa firmy:</label>
                        <input
                        type="text"
                        name="invoiceCompanyName"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Ulica i numer:</label>
                        <input
                        type="text"
                        name="invoiceStreet" 
                        onChange={this.handleChange} 
                        required>
                        </input>
                    </div>
                    <div className="field">
                        <label>*Kod pocztowy:</label>
                        <input
                        type="text"
                        name="invoiceZipCode"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Miejscowość:</label>
                        <input
                        type="text"
                        name="invoiceCity"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Numer NIP:</label>
                        <input
                        type="text"
                        name="invoiceNIP"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    {/* <label className="error-message">{this.state.error}</label> */}
                    {/* <button className="panel-button" form="identities">Edytuj</button><button className="panel-button">USUŃ</button> */}
                </form>
            </div>
            )

            const differentAddress = (
                <div className="shop-form ui form">
                <form id="differentIdentities">
                    <div className="shop-form-container"><div className="shop-form-header">Inny adres do wysyłki:</div><div className="field">
                        <label>*Imię i nazwisko/Nazwa firmy</label>
                        <input
                        type="text"
                        name="differentClientName"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div id="empty-error">To pole musi być wypełnione</div>
                    <div className="field">
                        <label>*Numer telefonu:</label>
                        <input
                        type="text"
                        name="differentTelephone"
                        id="differentTelephone"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div id="empty-error">To pole musi być wypełnione</div>
                    <div className="field">
                        <label>*Ulica i numer:</label>
                        <input
                        type="text"
                        name="differentStreet" 
                        onChange={this.handleChange} 
                        required>
                        </input>
                    </div>
                    <div id="empty-error">To pole musi być wypełnione</div>
                    <div className="field">
                        <label>*Kod pocztowy:</label>
                        <input
                        type="text"
                        name="differentZipCode"
                        id="differentZipCode"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div id="empty-error">To pole musi być wypełnione</div>
                    <div className="field">
                        <label>*Miejscowość:</label>
                        <input
                        type="text"
                        name="differentCity"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div id="empty-error">To pole musi być wypełnione</div>
                    </div>
                    {/* <label className="error-message">{this.state.error}</label> */}
                    {/* <button className="panel-button" form="identities">Edytuj</button><button className="panel-button">USUŃ</button> */}
                </form>
            </div>
            )

            const showForm = (
                <div><div className="identities-container">
                    <h2>Podaj swoje dane</h2>
    <div className="shop-form ui form">
                <form id="identities">
                    <div className="shop-form-container"><div className="shop-form-header">Dane podstawowe:</div>
                    <div className="field">
                        <label>*Imię i nazwisko / Nazwa firmy</label>
                        <input
                        type="text"
                        name="clientName"
                        value={this.state.clientName}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Adres e-mail:</label>
                        <input
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Numer telefonu:</label>
                        <input
                        type="text"
                        name="telephone"
                        id="telephone"
                        value={this.state.telephone}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="shop-form-header">Dane do wysyłki:</div>
                    <div className="field">
                        <label>*Ulica i numer:</label>
                        <input
                        type="text"
                        name="street" 
                        value={this.state.street}
                        onChange={this.handleChange} 
                        required>
                        </input>
                    </div>
                    <div className="field">
                        <label>*Kod pocztowy:</label>
                        <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        value={this.state.zipCode}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Miejscowość:</label>
                        <input
                        type="text"
                        name="city"
                        value={this.state.city}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="shop-form-header">Uwagi do zamówienia:</div>
                    <div className="field">
                        <label>Uwagi:</label>
                        <textarea
                        id="comment"
                        name="comment"
                        value={this.state.comment}
                        onChange={this.handleChange}
                        rows="5"
                        cols="20"
                        ></textarea>
                    </div>
                    </div>
                    <input 
                    type="checkbox" 
                    id="differentAddress" 
                    name="differentAddress" 
                    onChange={this.handleChange} 
                    value="differentAddress"/>
                    <label for="differentAddress">Inny adres dostawy</label><br/>
                    <input 
                    type="checkbox" 
                    id="invoice" 
                    name="invoice" 
                    onChange={this.handleChange} 
                    value="invoice"/>
                    <label for="invoice">Chcę fakturę</label>
                    {/* <label className="error-message">{this.state.error}</label> */}
                    {/* <button className="panel-button" form="identities">Edytuj</button><button className="panel-button">USUŃ</button> */}
                </form>
            </div>
            {this.state.differentAddress ? differentAddress : null}
            {this.state.invoice ? invoice : null}
            
            </div>
            <span style={{color: 'red'}}>{this.state.showSummaryError}</span>
            <div className="basket-action">
                <a href="#basket"><button onClick={this.handleBack} name="backToBasket" className="button-basket">WRÓĆ</button></a>
                <a href="#summary"><button onClick={this.handleShowSummary} className="button-basket">PODSUMOWANIE</button></a>
            </div>
            </div>

                        )


        const showInvoice = (
            <div className="invoice summary-identities-child">
                    <h2>Dane do faktury:</h2>
                    <div>Nazwa firmy: <span className="bold">{this.state.invoiceCompanyName}</span></div>
                    <div>Adres: <span className="bold">{this.state.invoiceStreet}</span></div>
                    <div>Kod i miejscowość: <span className="bold">{this.state.invoiceZipCode} {this.state.invoiceCity}</span></div>
                    <div>NIP: <span className="bold">{this.state.invoiceNIP}</span></div>
                </div>
        )

        const showDifferentAddress = (
            <div className="shipment-identities summary-identities-child">
                    <h2>Dane do wysyłki:</h2>
                    <div>Imie i nazwisko: <span className="bold">{this.state.differentClientName}</span></div>
                    <div>Numer telefonu: <span className="bold">{this.state.differentTelephone}</span></div>
                    <div>Adres: <span className="bold">{this.state.differentStreet}</span></div>
                    <div>Kod i miejscowość: <span className="bold">{this.state.differentZipCode} {this.state.differentCity}</span></div>
                </div>
        )

        const noDifferentAddress = (
            <div className="shipment-identities summary-identities-child">
                    <h2>Dane do wysyłki:</h2>
                    <div>Imie i nazwisko: <span className="bold">{this.state.clientName}</span></div>
                    <div>Numer telefonu: <span className="bold">{this.state.telephone}</span></div>
                    <div>Adres: <span className="bold">{this.state.street}</span></div>
                    <div>Kod i miejscowość: <span className="bold">{this.state.zipCode} {this.state.city}</span></div>
                </div>
        )
                
        const showSummary = (
        <div className="basket-content"><div className="basket-table"><div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr>
            <th colspan="2">Produkt</th>
            <th>Ilość</th>
            <th>Cena</th>
            <th>Wartość</th>
            </tr></thead>
            <tbody>
                {this.getProductsSummary()}
            </tbody>
            </table>
            </div>
            </div>
            <div className="under-basket-container">
                <div className="shipment-chosen">
                    <div>Metoda dostawy: <span className="bold">{this.state.shipmentName}</span></div>
                </div>
                <div className="payment-chosen">
                    <div>Metoda płatności: <span className="bold">{this.state.paymentName}</span></div>
                </div>

            <div className="basket-summary">
                <p className="summary-content">Ilość produktów w koszyku: <span className="summary-content-span">{this.state.howMany}</span></p>
                <p className="summary-content">Łączna wartość produktów: <span className="summary-content-span">{newCost} zł</span></p>
                <p className="summary-content">Koszt dostawy: <span className="summary-content-span">{newShipmentCost} zł</span></p>
                <p className="summary-content">Wartość zamówienia: <span className="summary-content-span">{newOverallCost} zł</span></p>
            </div>
            </div>
            <div className="summary-identities">
                <div className="buyer-identities summary-identities-child">
                    <h2>Dane kupującego:</h2>
                    <div>Imie i nazwisko: <span className="bold">{this.state.clientName}</span></div>
                    <div>Email: <span className="bold">{this.state.email}</span></div>
                    <div>Numer telefonu: <span className="bold">{this.state.telephone}</span></div>
                    <div>Adres: <span className="bold">{this.state.street}</span></div>
                    <div>Kod i miejscowość: <span className="bold">{this.state.zipCode} {this.state.city}</span></div>
                </div>
                {this.state.differentAddress ? showDifferentAddress : noDifferentAddress}
                {this.state.invoice ? showInvoice : <div className="summary-identities-child">
                    <h2>Faktura</h2>

                    <div>Nie wybrano</div>
                    </div>}
            </div>
            <div className="basket-action">
                <button onClick={this.handleBack} name="backToIdentities"className="button-basket">WRÓĆ</button>
                <button onClick={this.handleTakeOrder} className="button-basket">ZŁÓŻ ZAMÓWIENIE</button>
            </div>
            </div>
        )

        const showBasket = (
            <div><section id="basket">
            <div className="basket-content"><div className="basket-message">{this.state.message}</div><div className="basket-header">Zawartość Twojego koszyka:</div>
            <div className="basket-table"><div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr>
            <th colspan="2">Produkt</th>
            <th>Ilość</th>
            <th>Cena</th>
            <th>Wartość</th>
            <th>Usuń</th>
            </tr></thead>
            <tbody>
                {this.getProducts()}
            </tbody>
            </table>
            </div>
            </div>
            <div className="under-basket-container">
                <div className="shipment-methods">
                    <RenderShipments shipmentSelected={this.addShipmentCost} shipments={this.state.shipments} selectedShipment={this.state.selectedShipment}/>
                    <span style={{color:'red'}}>{this.state.shipmentError}</span>
                </div>
                <div className="payment-methods">
                    <RenderPayments paymentSelected={this.addPaymentMethod} payments={this.state.payments} selectedPayment={this.state.selectedPayment} />
                    <span style={{color:'red'}}>{this.state.paymentError}</span>
                </div>
            <div className="basket-summary">
                <p className="summary-content">Ilość produktów w koszyku: <span className="summary-content-span">{this.state.howMany}</span></p>
                <p className="summary-content">Łączna wartość produktów: <span className="summary-content-span">{newCost} zł</span></p>
                <p className="summary-content">Koszt dostawy: <span className="summary-content-span">{newShipmentCost} zł</span></p>
                <p className="summary-content">Wartość zamówienia: <span className="summary-content-span">{newOverallCost} zł</span></p>


            </div>
            </div>
            <div className="basket-action">
                <a href="/sklep"><input type="button" className="button-basket" value="KONTYNUUJ ZAKUPY"/></a>
                <a href="#order-identities"><input onClick={this.handleOrderClicked} type="button" className="button-basket" value="DALEJ"/></a>
            </div>
            </div></section>
            </div>
        )

        const hideBasket = (
            <div className="hidden-basket">{this.state.hideBasket ? null : showBasket}</div>
        )

        const isEmpty = (
            <div id="basket-container" className="basket-container">                                {this.state.error}
            {this.state.empty ? <div>Koszyk jest pusty, przykro mi, kup se coś najpierw</div> : hideBasket}
            </div>
        )


        const loading = ( <div>...Wczytuję dane...</div>
            )

        return (
            <div id="shop-content" className="shop-content">
                {/* <ShopMenu/> */}
                {this.state.loaded ? isEmpty : loading}
                <section id="order-identities">
                {this.state.orderClicked ? showForm : null}
            </section>
            <section id="summary">
                {this.state.identitiesSet ? showSummary : null}
            </section></div>
                   )
    }
}

const mapStateToProps = state => {
    return { basket: state.basket, shipments: state.shipments, payments: state.payments, order: state.order };
};
export default connect(
    mapStateToProps,
    { getBasket, updateBasket, deleteBasket, getShipments, getPayments, addOrder }
)(BasketView);