import React from 'react';
import ShopMenu from './ShopMenu';
import {getBasket, updateBasket, deleteBasket, getShipments, getPayments, addOrder, getCustomer, fetchPaczkomatByCity, fetchPaczkomatByPostCode, checkDiscount} from '../actions';
import { connect } from 'react-redux';
import {changeView, changeString, deleteCookie, getCookie, countProducts, setCookie} from '../js/index';
import { Redirect } from 'react-router-dom';
import { RenderShipments } from './RenderShipments.js';
import { RenderPayments } from './RenderPayments.js';
import { faJournalWhills, faIgloo } from '@fortawesome/free-solid-svg-icons';


class BasketView extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            productId: '',
            name: '',
            productCode: '',
            productImage: '',
            price: '',
            color: '',
            variantValue:'',
            loaded: false,
            error: '',
            comment: '',
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
            hideBasket: false,
            customerLogged: false,
            customerId: '',
            customerLogin: '',
            customerEmail: '',
            showPaczkomaty: false,
            paczkomatCity: '',
            paczkomatPostCode: '',
            paczkomatError: '',
            fetchedPaczkomat: [],
            lockerSelected: '',
            orderError: '',
            discount: false,
            discountCode: '',
            discountError: '',
            discountActive: false,
            regAccept: false,
            privacyPolicy: false
                
        }
    }

    countOrderCost() {

        let cost = this.state.cost;
        console.log(cost)
        
        let orderCost = cost + this.state.shipmentCost;

        let orderRound = Number(Math.round(orderCost + 'e+2') + 'e-2')
        
        return orderRound
    }

    async componentDidMount() {
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
            let sum = countProducts(this.state.products);
            this.setState({howMany: sum});
        } catch (err) {
            // localStorage.removeItem("basketId");
            deleteCookie('basketId');
            this.setState({error: err.response.data})
        }

        let customerId = getCookie("customerId");
        if(customerId) {
            const jwt = getCookie("jwt")
            try{
        await this.props.getCustomer(customerId, jwt)
            } catch(err) {
                setCookie("customerId", "", 0.00001)
                setCookie("jwt", "", 0.00001)
                return window.location.replace(`${window.location.origin}/sklep`)
            }
            this.setState({clientName: this.props.customer.customerIdentities.name})
            this.setState({street: this.props.customer.customerIdentities.street})
            this.setState({telephone: this.props.customer.customerIdentities.telephone})
            this.setState({email: this.props.customer.email})
            this.setState({zipCode: this.props.customer.customerIdentities.zipCode})
            this.setState({city: this.props.customer.customerIdentities.city})
            this.setState({customerLogin: this.props.customer.login})
            this.setState({customerEmail: this.props.customer.email})
            this.setState({customerId: this.props.customer._id})
            this.setState({customerLogged: true})
        }

        this.setState({loaded: true});
        this.setState({empty: false});


    }
    componentDidUpdate = async () => {
        if(this.state.renderSite) {
            await this.props.getBasket(this.state.basketId)
            await this.setState({products: this.props.basket.products});
            this.setState({selectedShipment: null})
            this.setState({howMany: countProducts(this.state.products)})
            let cost = this.props.basket.cost;
            if(this.state.discountActive) {
                if(this.state.discountType==="Procent") {
                    cost= cost * this.state.discountValue;
                } else {
                    cost = cost - this.state.discountValue;
                }
            }
            this.setState({cost: cost});
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
        let array = e.target.name.split('-');
        let color = array[0];
        let variantName= array[1];
        let variantValue = array[2];
        let element = document.getElementById(e.target.id);
        try {
            await this.props.updateBasket(this.state.basketId, e.target.id, 1, "insertion", color, variantName, variantValue);
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
        let array = e.target.name.split('-');
        let color = array[0];
        let variantName = array[1];
        let variantValue = array[2];
        let isError = document.getElementById("errorSpan");
        if(isError) {
            isError.remove();
        }       
        await this.props.updateBasket(this.state.basketId, e.target.id, 1, "deletion", color, variantName, variantValue);
        this.setState({renderSite: true});
    }

    handleDeleteProduct = async e => {
        e.preventDefault();
        let array = e.target.name.split('-');
        let color = array[0];
        let variantName = array[1];
        let variantValue = array[2];
        console.log("click")
        let isError = document.getElementById("errorSpan");
        if(isError) {
            console.log(isError);
            isError.remove();
        }
        await this.props.updateBasket(this.state.basketId, e.target.id, "all", "deletion", color, variantName, variantValue);
        console.log(this.props.basket)
        this.setState({insertionError:''})
        this.setState({renderSite: true});
    }

    addShipmentCost = async (selectedShipment) => {
        if(selectedShipment.freeShipment != "") {
            let freeShipment = Number(selectedShipment.freeShipment);
            if(this.state.cost >= freeShipment) {
                this.setState({shipmentCost: 0})
            } else { this.setState({shipmentCost: selectedShipment.price}) }
        
        } else { this.setState({shipmentCost: selectedShipment.price});
    }
        this.setState({selectedShipment: selectedShipment});
        if(selectedShipment.name=="Paczkomaty InPost") {
            this.setState({showPaczkomaty: true})
        } else {
            this.setState({showPaczkomaty: false})
            this.setState({fetchedPaczkomat: []})
        }
        this.setState({shipmentError: ''})
        this.setState({shipmentName: selectedShipment.name});
        this.setState({shipmentId: selectedShipment._id})
        // if(this.state.selectedShipment!=null && this.state.selectedPayment!=null) {
        //     let cost=0;
        //     for(let i =0;i<selectedShipment.payments.length;i++) {
        //         if(selectedShipment.payments[i]._id===this.state.selectedPayment._id) {
        //             console.log("abc "+ selectedShipment.payments[i].name)
        //             cost = Number(this.state.selectedShipment.payments[i].additionalCost);
        //             console.log(cost)
        //         }
        //     }
        // this.setState({shipmentCost: this.state.selectedShipment.price + cost})
        // }
        this.setState({selectedPayment: null})
        let overallCost = this.state.cost + this.state.shipmentCost;
        let costRound = await Number(Math.round(overallCost + 'e+2') + 'e-2')
        await this.setState({overallCost: costRound });
    }

    addPaymentMethod = async (selectedMethod) => {
        this.setState({selectedPayment: selectedMethod});
        this.setState({paymentError: ''})
        this.setState({paymentName: selectedMethod.name});
        this.setState({paymentId: selectedMethod._id});
        let cost = Number(selectedMethod.additionalCost);
        if(!isNaN(cost) && this.state.shipmentCost > 0) {
        this.setState({shipmentCost: this.state.selectedShipment.price + cost})
        }
        let overallCost = this.state.cost + this.state.shipmentCost;
        let costRound = await Number(Math.round(overallCost + 'e+2') + 'e-2')
        await this.setState({overallCost: costRound });
    }

    handleFetchPacz = async e => {
        e.preventDefault();
        this.setState({paczkomatError: ''});

        switch(e.target.name) {
            case 'byCity':
                if(this.state.paczkomatCity.length>0) {
                    await this.props.fetchPaczkomatByCity(this.state.paczkomatCity);
                    this.setState({fetchedPaczkomat: this.props.paczkomaty})
                } else { 
                    this.setState({paczkomatError: "Wpisz nazwę miasta, żeby wyszukać"})
                }
                if(this.state.fetchedPaczkomat.length==0) {
                    this.setState({paczkomatError: "Brak paczkomatów dla podanych parametrów"})
                }
                
            break;
            case 'byPostCode':
                const regexzipCode = /\b\d{2}-\d{3}\b/
                if(regexzipCode.test(this.state.paczkomatPostCode)) {
                    await this.props.fetchPaczkomatByPostCode(this.state.paczkomatPostCode)
                    this.setState({fetchedPaczkomat: this.props.paczkomaty})
                } else { this.setState({paczkomatError: "Błędny format kodu pocztowego, poprawny format: 12-345"})}
                if(this.state.fetchedPaczkomat.length==0) {
                    this.setState({paczkomatError: "Brak paczkomatów dla podanych parametrów"})
                }
                break;
            default:
                break;

        }
    }

    renderOptions() {
        return this.state.fetchedPaczkomat.map(paczkomat=> {
            return <option value={paczkomat.name} description={paczkomat.location_description} address={paczkomat.address.line1} postCode={paczkomat.address.line2}>{paczkomat.name}, {paczkomat.address.line1}, {paczkomat.address.line2} </option>
        })
    }

    renderPaczkomaty() {
        if(this.state.fetchedPaczkomat.length>5) {
            return <select name="selectPaczkomat"onChange={this.handleChange}>
                <option value="">Wybierz z listy</option>
                {this.renderOptions()}
            </select>
        } else {
            console.log("mniej niz 5")
            return this.state.fetchedPaczkomat.map(paczkomat => {
                return <div><input description={paczkomat.location_description} address={paczkomat.address.line1} postCode={paczkomat.address.line2} onChange={this.handleChange} type="radio" name="choosePaczkomat" id={paczkomat.name} value={paczkomat.name}/><label>{paczkomat.name}, {paczkomat.address.line1}, {paczkomat.address.line2}</label></div>
            })
        }
         
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
        if(this.state.showPaczkomaty && this.state.lockerSelected=='') {
            return await this.setState({paczkomatError: "Musisz wybrać paczkomat, zanim przejdziesz dalej"})
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
        this.setState({privacyPolicy: false});
            this.setState({regAccept: false});
        let element = document.getElementById('basket-container')
        element.style.display="block";
        } else if(e.target.name==="backToIdentities") {
            this.setState({orderClicked: true})
            this.setState({identitiesSet: false});
            this.setState({privacyPolicy: false});
            this.setState({regAccept: false});

        }

    }

    handleShowSummary = e => {
        if(!this.state.regAccept || !this.state.privacyPolicy) { return this.setState({showSummaryError: "Należy zaznaczyć obie zgody zaznaczone gwiazdką, by móc złożyć zamówienie."})}
        const regexzipCode = /\b\d{2}-\d{3}\b/
        const regextelephone = new RegExp('^[0-9]+$')
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
            let color='';
            let variant='';
            if(product.color!="") {
                color="Kolor: " + product.color
            }
            if(product.variantName!="") {
                variant= product.variantName + ": " + product.variantValue
            }
            return (<tr>
            <td data-label="Obraz"><a href={`/sklep/p/${newString}/${product.ID}`}><img style={{width: "80px", height: "auto"}}src={product.productImage[0]}/></a></td>
            <td data-label="Nazwa"><a href={`/sklep/p/${newString}/${product.ID}`}>{product.name}</a><br/>{color}<br/>{variant}</td>
            <td data-label="Ilość"><input onClick={this.handleDeleteOne} name={`${product.color}-${product.variantName}-${product.variantValue}`} id={product._id} className="button-amount minus" type="button" value="-"></input><input className="input-amount" type="text" value={product.amount}></input><input onClick={this.handleAddOne} name={`${product.color}-${product.variantName}-${product.variantValue}`} id={product._id} className="button-amount plus" type="button" value="+"></input> </td>
            <td data-label="Cena">{newPrice}</td>
            <td data-label="Wartość">{newValue}</td>
            <td><input onClick={this.handleDeleteProduct} name={`${product.color}-${product.variantName}-${product.variantValue}`} id={product._id}className="delete-basket" type="button" value="X"></input></td>
        </tr>)}
        )
    }

    getProductsSummary = () => {
        
        return this.state.products.map(product => {
            let newPrice = changeView(product.price);
            let value = product.price * product.amount;
            let newValue = changeView(value);
            let newString = changeString(product.name);
            let color='';
            let variant='';
            if(product.color!='') {
                color="Kolor: " + product.color
            }
            if(product.variant!='') {
                variant= product.variantName + ": " + product.variantValue
            }
            return (<tr>
            <td data-label="Obraz"><a href={`/sklep/p/${newString}/${product.ID}`}><img style={{width: "80px", height: "auto"}}src={product.productImage[0]}/></a></td>
            <td data-label="Nazwa"><a href={`/sklep/p/${newString}/${product.ID}`}>{product.name}</a><br/>{color}<br/>{variant}</td>
            <td data-label="Ilość"><label>{product.amount}</label></td>
            <td data-label="Cena">{newPrice}</td>
            <td data-label="Wartość">{newValue}</td>
        </tr>)}
        )
    }

    handlePlaceOrder = async e => {
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
        } else if(this.state.showPaczkomaty) {
            shipmentIdentities = {
                name: this.state.lockerSelected.name,
                telephone: this.state.telephone,
                street: this.state.lockerSelected.address,
                zipCode: this.state.lockerSelected.postCode,
                city: ''       
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
            _id: this.state.customerId,
            login: this.state.customerLogin,
            email: this.state.customerEmail
        }
    
        
        try {
            await this.props.addOrder(customerIdentities, shipmentIdentities, invoiceIdentities, customer, this.state.products, this.state.shipmentId, this.state.shipmentCost, this.state.paymentId, this.state.cost, this.state.comment, this.state.discountActive, this.state.discountUsed )
        } catch (err) {
            console.log(err)
            return this.setState({orderError: err.response.data})
        }
        window.location.replace(`${window.location.origin}/sklep/o/order_summary`);
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
            case 'paczkomatPostCode':
                this.setState({paczkomatPostCode: event.target.value});
                break;
            case 'paczkomatCity':
                this.setState({paczkomatCity: event.target.value});
                break;
            case 'choosePaczkomat':
                console.log(event.target)
                let x = {
                    description: event.target.attributes.description.value,
                    address: event.target.attributes.address.value,
                    postCode: event.target.attributes.postCode.value,
                    name: event.target.id
                }
                await this.setState({lockerSelected: x})
                break;
            case 'selectPaczkomat':
                let y = {
                    description: event.target.attributes.description.value,
                    address: event.target.attributes.address.value,
                    postCode: event.target.attributes.postCode.value,
                    name: event.target.value
                }
                this.setState({lockerSelected: y})
                break;
            case 'discountCheckbox':
                if(event.target.checked) {
                    this.setState({discount: true})
                } else {
                    this.setState({discount: false})
                }
                break;
            case 'discountCode':
                this.setState({discountCode: event.target.value});
                break;
            case 'regAccept':
                if(event.target.checked) {
                    this.setState({regAccept: true})
                } else {
                    this.setState({regAccept: false})
                }
                break;
            case 'privacyPolicy':
                if(event.target.checked) {
                    this.setState({privacyPolicy: true})
                } else {
                    this.setState({privacyPolicy: false})
                }
                break;
            default:
                break;
        }
    };

    handleDifferentAddress = () => {
        if(this.state.differentAddress===false) {
            this.setState({ differentAddress: true})
        } else {
        this.setState({ differentAddress: false})
        this.setState({ differentClientName: ''})
        this.setState({ differentStreet: ''})
        this.setState({ differentZipCode: ''})
        this.setState({ differentCity: ''})
        this.setState({ differentTelephone: ''})

        }
    }

    handleInvoice = () => {
        if(this.state.invoice===false) {
            this.setState({ invoice: true})
            if(this.props.customer.login) {
            this.setState({invoiceCompanyName: this.props.customer.companyIdentities.companyName})
            this.setState({invoiceStreet: this.props.customer.companyIdentities.companyStreet})
            this.setState({invoiceZipCode: this.props.customer.companyIdentities.companyZipCode})
            this.setState({invoiceCity: this.props.customer.companyIdentities.companyCity})
            this.setState({invoiceNIP: this.props.customer.companyIdentities.companyNIP})
            }
        } else {
        this.setState({invoice: false})
        this.setState({invoiceCompanyName: ''})
        this.setState({invoiceStreet: ''})
        this.setState({invoiceZipCode: ''})
        this.setState({invoiceCity: ''})
        this.setState({invoiceNIP: ''})
        }
    }

    handleCheckDiscount = async () => {
        this.setState({discountError: ''})
        if(this.state.discountCode==='') {
            this.setState({discountError: "Musisz wpisać kod rabatowy"})
        } else {
            try {
                await this.props.checkDiscount(this.state.discountCode, this.state.customerId);
                if(this.props.discount.type==="Procent") {
                    let value = this.props.discount.value/100;
                    let cost = this.state.cost*(1-value);
                    let costRound = Number(Math.round(cost + 'e+2') + 'e-2')
                    this.setState({discountAmount: this.state.cost*value});
                    this.setState({cost: costRound})
                    this.setState({discountType: "Procent"});
                    this.setState({discountValue: 1-value})
                    this.setState({discountActive: true})
                    this.setState({discountUsed: this.state.discountCode})
                } else {
                    let cost = this.state.cost - this.props.discount.value;
                    if(cost<=0) { this.setState({discountError: "Kwota rabatu nie może być wyższa niż kwota zakupów"})}
                    else {
                        let costRound = Number(Math.round(cost + 'e+2') + 'e-2')
                        this.setState({discountAmount: this.props.discount.value});
                        this.setState({cost: costRound})
                        this.setState({discountType: "Kwota"});
                        this.setState({discountValue: this.props.discount.value})
                        this.setState({discountActive: true})
                        this.setState({discountUsed: this.state.discountCode})
                    }
                }

            } catch(err) {
                this.setState({discountError: err.response.data});
            }
        }

    }

    handleDeleteDiscount = async () => {
        let basketId = getCookie("basketId");
        await this.props.getBasket(basketId);
        this.setState({cost: this.props.basket.cost})
        this.setState({discountActive: false})
        this.setState({discountAmount: 0})
        this.setState({discountValue:0});
        this.setState({discountType:""})
    }


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
                        value={this.state.invoiceCompanyName}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Ulica i numer:</label>
                        <input
                        type="text"
                        name="invoiceStreet" 
                        value={this.state.invoiceStreet}
                        onChange={this.handleChange} 
                        required>
                        </input>
                    </div>
                    <div className="field">
                        <label>*Kod pocztowy:</label>
                        <input
                        type="text"
                        name="invoiceZipCode"
                        value={this.state.invoiceZipCode}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Miejscowość:</label>
                        <input
                        type="text"
                        name="invoiceCity"
                        value={this.state.invoiceCity}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Numer NIP:</label>
                        <input
                        type="text"
                        name="invoiceNIP"
                        value={this.state.invoiceNIP}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
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
                    <div className="field">
                        <label>*Numer telefonu:</label>
                        <input
                        type="text"
                        name="differentTelephone"
                        id="differentTelephone"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Ulica i numer:</label>
                        <input
                        type="text"
                        name="differentStreet" 
                        onChange={this.handleChange} 
                        required>
                        </input>
                    </div>
                    <div className="field">
                        <label>*Kod pocztowy:</label>
                        <input
                        type="text"
                        name="differentZipCode"
                        id="differentZipCode"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>*Miejscowość:</label>
                        <input
                        type="text"
                        name="differentCity"
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                </form>
            </div>
            )

            const showForm = (
                <div>                    <h2>Podaj swoje dane</h2>

                    <div className="identities-container">
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
                    {this.state.lockerSelected!='' && this.state.showPaczkomaty ? null : <><input 
                    type="checkbox" 
                    id="differentAddress" 
                    name="differentAddress" 
                    className="checkbox"
                    onChange={this.handleDifferentAddress} 
                    value="differentAddress"/>
                    <label for="differentAddress"> Inny adres dostawy</label></> }
                    <br/>
                    <input 
                    className="checkbox"
                    type="checkbox" 
                    id="invoice" 
                    name="invoice" 
                    onChange={this.handleInvoice} 
                    value="invoice"/>
                    <label for="invoice"> Chcę fakturę</label>
                </form>
            </div>
            {this.state.differentAddress ? differentAddress : null}
            {this.state.invoice ? invoice : null}
            
            </div>
            <span style={{color: 'red'}}>{this.state.showSummaryError}</span>
            <div className='accepts-container'>
            <label><input
                type="checkbox"
                className="checkbox"
                name="regAccept"
                onChange={this.handleChange}
                /> <b>*</b> Oświadczam, że zapoznałem się z Regulaminem sklepu oraz akceptuję jego warunki.</label>
                <label><input
                type="checkbox"
                className="checkbox"
                name="privacyPolicy"
                onChange={this.handleChange}
                /> <b>*</b> Oświadczam, że zapoznałem się z polityką prywatności sklepu "Torebkowa Mania".</label>
                <div className="basket-action">
                
                <a href="#basket"><button onClick={this.handleBack} name="backToBasket" className="button-basket">WRÓĆ</button></a>
                <a href="#summary"><button onClick={this.handleShowSummary} className="button-basket">PODSUMOWANIE</button></a>
            </div>
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

        const showAddress = (
            <div className="shipment-identities summary-identities-child">
                    <h2>Dane do wysyłki:</h2>
                    <div>Imie i nazwisko: <span className="bold">{this.state.differentClientName}</span></div>
                    <div>Numer telefonu: <span className="bold">{this.state.differentTelephone}</span></div>
                    <div>Adres: <span className="bold">{this.state.differentStreet}</span></div>
                    <div>Kod i miejscowość: <span className="bold">{this.state.differentZipCode} {this.state.differentCity}</span></div>
                </div>
        )

        const showPaczkomat = (
            <div className="shipment-identities summary-identities-child">
                    <h2>Paczkomat:</h2>
                    <div>Nazwa: <span className="bold">{this.state.lockerSelected.name} - {this.state.lockerSelected.description}</span></div>
                    <div>Adres: <span className="bold">{this.state.lockerSelected.address}</span></div>
                    <div>Kod i miejscowość: <span className="bold">{this.state.lockerSelected.postCode}</span></div>
                    <div>Numer telefonu: <span className="bold">{this.state.telephone}</span></div>
                    <div>Email: <span className="bold">{this.state.email}</span></div>
                </div>
        )

        const showDifferentAddress = (
            <>{this.state.showPaczkomaty ? showPaczkomat : showAddress}</>
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
                {this.state.discountActive ? <p>Użyty kod rabatowy: "<span style={{fontStyle:"italic"}}>{this.props.discount.code}</span>", kwota rabatu: {this.state.discountAmount} zł</p>: null}
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
                {this.state.differentAddress || this.state.showPaczkomaty ? showDifferentAddress : noDifferentAddress}
                {this.state.invoice ? showInvoice : <div className="summary-identities-child">
                    <h2>Faktura</h2>

                    <div>Nie wybrano</div>
                    </div>}
            </div>
            <div className="basket-action">
                <button onClick={this.handleBack} name="backToIdentities"className="button-basket">WRÓĆ</button>
                <button onClick={this.handlePlaceOrder} className="button-basket">ZŁÓŻ ZAMÓWIENIE</button>
            </div>
            <span style={{color:"red"}, {fontSize: "20px"}}>{this.state.orderError}</span>
            </div>
        )

        const showInput = (
            <><input
            type="text"
            name="discountCode"
            onChange={this.handleChange}
            placeholder="Wpisz kod rabatowy"
            />
            {this.state.discountActive ? <button className="button-basket" onClick={this.handleDeleteDiscount}>USUŃ KOD</button> : <button className="button-basket" onClick={this.handleCheckDiscount}>DODAJ KOD</button>}</>
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
                    <h3>Metoda dostawy:</h3><RenderShipments shipmentSelected={this.addShipmentCost} shipments={this.state.shipments} selectedShipment={this.state.selectedShipment}/>
                    <span style={{color:'red'}}>{this.state.shipmentError}</span>
                </div>
                <div className="payment-methods">
                    {this.state.selectedShipment!=null ? <><h3>Metoda płatności:</h3><RenderPayments paymentSelected={this.addPaymentMethod} payments={this.state.selectedShipment.payments} selectedPayment={this.state.selectedPayment} /></> : null }
                    <span style={{color:'red'}}>{this.state.paymentError}</span>
                    {this.state.showPaczkomaty ?
                    <><h3>Wybierz paczkomat:</h3> 
                    <div className="paczkomaty"><label>Podaj kod pocztowy
                        <input type="text" name="paczkomatPostCode" onChange={this.handleChange}/>
                         
                        <button name="byPostCode" className="button-basket-small" onClick={this.handleFetchPacz}>POKAŻ</button></label>
                        <label>Wpisz miasto
                        <input type="text" name="paczkomatCity" onChange={this.handleChange}/>
                         
                        <button name="byCity"className="button-basket-small"onClick={this.handleFetchPacz}>POKAŻ</button></label>
                        
                        <span style={{color:'red'}}>{this.state.paczkomatError}</span>
</div></>
                    : null}
                    {this.state.showPaczkomaty && this.state.fetchedPaczkomat.length>0 ? <>{this.renderPaczkomaty()}</> :null}
                </div>
            <div className="basket-summary">
                <p className="summary-content">Ilość produktów w koszyku: <span className="summary-content-span">{this.state.howMany}</span></p>
                <p className="summary-content">Łączna wartość produktów: <span className="summary-content-span">{newCost} zł</span></p>
                <p className="summary-content">Koszt dostawy: <span className="summary-content-span">{newShipmentCost} zł</span></p>
                <p className="summary-content">Wartość zamówienia: <span className="summary-content-span">{newOverallCost} zł</span></p>
                <label><input
                type="checkbox"
                name="discountCheckbox"
                onChange={this.handleChange}
                />Mam kod rabatowy</label>
                {this.state.discount ? showInput : null}
                <span style={{color: "red"}}>{this.state.discountError}</span>


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
    return { basket: state.basket, shipments: state.shipments, payments: state.payments, order: state.order, customer: state.customer, paczkomaty: state.paczkomaty, discount: state.discount };
};
export default connect(
    mapStateToProps,
    { getBasket, updateBasket, deleteBasket, getShipments, getPayments, addOrder, getCustomer, fetchPaczkomatByCity, fetchPaczkomatByPostCode, checkDiscount }
)(BasketView);