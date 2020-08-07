import React from 'react';
import { connect } from 'react-redux';
import { getCustomer, updateCustomer, updateData, updateInvoice, getOrdersByClient, deleteCustomer } from '../../actions';
import { Redirect } from 'react-router-dom';
import { changeView, getCookie } from '../../js/index';
import { baseURL } from '../../api/index';

class CustomerForm extends React.Component {
    constructor(props) {
        super(props)
    this.state = {
            _id: null,
            name: '',
            email: '',
            currentPassword: '',
            password: '',
            confirmPassword: '',
            isUpdated: false,
            errorEdit: '',
            errorPassword:'',
            customerName: '',
            customerTelephone: '',
            customerStreet: '',
            customerZipCode: '',
            customerCity: '',
            companyName: '',
            companyStreet: '',
            companyZipCode: '',
            companyCity: '',
            companyNIP: '',
            customerIdentities: {},
            companyIdentities: {},
            showData: true,
            showOrders: false,
            orders: []



        }
    }

    componentDidMount = async () => {
        const jwt = getCookie('jwt');
        await this.props.getCustomer(this.props.match.params.id, jwt);
        await this.props.getOrdersByClient(this.props.match.params.id, jwt);
        this.setState({orders: this.props.orders})
        this.setState({_id: this.props.customer._id})
        this.setState({login: this.props.customer.login})
        this.setState({email: this.props.customer.email})
        this.setState({customerIdentities: this.props.customer.customerIdentities})
        this.setState({companyIdentities: this.props.customer.companyIdentities})


    }

    handleChange = async event => {
        let data = event.target.value
        switch (event.target.name) {
            case 'login':
               this.setState({ login: event.target.value });
                break;
            case 'email':
               this.setState({ email: event.target.value });
                break;
            case 'customerName':
                this.setState(prevState => {
                    let customerIdentities = Object.assign({}, prevState.customerIdentities);
                    customerIdentities.name = data;
                    return {customerIdentities}
                })
                break;
            case 'customerStreet':
                this.setState(prevState => {
                    let customerIdentities = Object.assign({}, prevState.customerIdentities);
                    customerIdentities.street = data;
                    return {customerIdentities}
                })
                break;
            case 'customerTelephone':
                this.setState(prevState => {
                    let customerIdentities = Object.assign({}, prevState.customerIdentities);
                    customerIdentities.telephone = data;
                    return {customerIdentities}
                })
                break;
            case 'customerZipCode':
                this.setState(prevState => {
                    let customerIdentities = Object.assign({}, prevState.customerIdentities);
                    customerIdentities.zipCode = data;
                    return {customerIdentities}
                })
                break;
            case 'customerCity':
                this.setState(prevState => {
                    let customerIdentities = Object.assign({}, prevState.customerIdentities);
                    customerIdentities.city = data;
                    return {customerIdentities}
                })
                break;
            case 'companyName':
                this.setState(prevState => {
                    let companyIdentities = Object.assign({}, prevState.companyIdentities);
                    companyIdentities.companyName = data;
                    return {companyIdentities}
                })
                break;
            case 'companyStreet':
                this.setState(prevState => {
                    let companyIdentities = Object.assign({}, prevState.companyIdentities);
                    companyIdentities.companyStreet = data;
                    return {companyIdentities}
                })
                break;
            case 'companyZipCode':
                this.setState(prevState => {
                    let companyIdentities = Object.assign({}, prevState.companyIdentities);
                    companyIdentities.companyZipCode = data;
                    return {companyIdentities}
                })
                break;
            case 'companyCity':
                this.setState(prevState => {
                    let companyIdentities = Object.assign({}, prevState.companyIdentities);
                    companyIdentities.companyCity = data;
                    return {companyIdentities}
                })
                break;
            case 'companyNIP':
                this.setState(prevState => {
                let companyIdentities = Object.assign({}, prevState.companyIdentities);
                companyIdentities.companyNIP = data;
                return {companyIdentities}
            })
            break;
            default:
                break;
        }
    };

    showSuccess(message) {
        let element = document.getElementById("root");
        let statusChanged = document.createElement("div")
        statusChanged.setAttribute("class", "status-changed");
        statusChanged.innerHTML=message;
        element.after(statusChanged);
        setTimeout(function() {
            statusChanged.remove()}, 2000)

            if(message="Użytkownik usunięty") {
                window.location.replace(`${baseURL}/admin/customers`)
            }
        
    }


    handleUpdateCustomer = async (e) => {
        e.preventDefault();
        const jwt = getCookie('jwt');
        try {
        const {_id, login, email} = this.state;
        await this.props.updateCustomer(_id, login, email, jwt);
        this.setState({isUpdated: true});
        } catch (err) {
            this.setState({loginError: err.response.data});
        }
    
    }

    handleUpdateData = async e => {
        e.preventDefault();
        const jwt = getCookie('jwt')
        const {_id, name, telephone, street, zipCode, city} = this.state.customerIdentities
        try {
            await this.props.updateData(this.state._id, name, telephone, street, zipCode, city, jwt);
            this.showSuccess(this.props.customer.message);
        } catch (err) {
            this.setState({dataError: err.response.data})
        }
    }

    handleUpdateCompany = async e => {
        e.preventDefault();
        const jwt = getCookie('jwt');
        const {companyName, companyStreet, companyZipCode, companyCity, companyNIP} = this.state.companyIdentities
        try {
            await this.props.updateInvoice(this.state._id, companyName, companyStreet, companyZipCode, companyCity, companyNIP, jwt);
            this.showSuccess(this.props.customer.message);
        } catch (err) {
            this.setState({companyError: err.response.data})
        }
    }

    handleDeleteCustomer = async e => {
        e.preventDefault();
        const jwt = getCookie('jwt')
        try {
            await this.props.deleteCustomer(this.state._id, jwt);
        } catch (err) {
            this.setState({dataError: err.response.data})
        }
        this.showSuccess("Użytkownik usunięty");

    }

    handleMenu = e => {
        let data = document.getElementById("data");
        let orders = document.getElementById("orders");
        switch(e.target.id) {
            case 'data':
                data.setAttribute("class", "top-menu-button button-active")
                orders.setAttribute("class", "top-menu-button")
                this.setState({showData: true});
                this.setState({showOrders: false});
            break;
            case 'orders':
                orders.setAttribute("class", "top-menu-button button-active")
                data.setAttribute("class", "top-menu-button")
                this.setState({showData: false});
                this.setState({showOrders: true});
            break;
            default:
                break;
        }

    }
    renderTable = () => {
        
        return this.state.orders.map( order => {
            let value = changeView(order.value);
            return (
                <tr id={order.ID}>
                    <td data-label="ID"><a href={`/admin/orders/show/details/${order.ID}`}>{order.ID}</a></td>
                    <td data-label="Kupujący"><a href={`/admin/orders/show/details/${order.ID}`}>{order.customerIdentities.name}</a></td>
                    <td data-label="Metoda dostawy">{order.shipment.name}</td>
                    <td data-label="Płatność">{order.payment.name}</td>
                    <td data-label="Wartość">{value}</td>
                    <td data-label="Status">{order.status.name}</td>
                    <td>SZCZEGÓŁY</td>
                </tr>
            )
        })
    }

    render() {
               const { login, email, customerIdentities, companyIdentities } = this.state;  
               
               const renderOrders = (
                <>
                <h2>Zamówienia klienta </h2>
                

                            <div id=""className="ui relaxed divided list"><table id="table" className="ui celled table">
                                <thead>
                                <tr>
                                <th>ID</th>
                                <th>Kupujący</th>
                                <th>Metoda dostawy</th>
                                <th>Płatność</th>
                                <th>Wartość</th>
                                <th>Status</th>
                                </tr></thead>
                                <tbody>
                                    {this.renderTable()}
                                </tbody>
                                </table>
                            </div>  

                            </>
                
               )
        const renderData = (
            <>   
         <div className="ui form">
                <form id="updateCustomer">
                    <label>Dane klienta:</label>
                    <div className="panel-form-container">
                        <div className="panel-form-header">Dane podstawowe:</div>
                        <div className="field">
                        <label>Login</label>
                        <input
                        type="text"
                        name="login"
                        value={login}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Adres email</label>
                        <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <label className="error-message">{this.state.loginError}</label>
                    <button className="panel-button" form="updateCustomer" onClick={this.handleUpdateCustomer}>Edytuj dane</button>
                </form>
                <form id="updateData">
                    <div className="panel-form-container">
                        <div className="panel-form-header">Dane do wysyłki:</div>
                        <div className="field">
                        <label>Imię i nazwisko</label>
                        <input
                        type="text"
                        name="customerName"
                        value={this.state.customerIdentities.name}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Telefon</label>
                        <input
                        type="text"
                        name="customerTelephone"
                        value={this.state.customerIdentities.telephone}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Adres</label>
                        <input
                        type="text"
                        name="customerStreet"
                        value={this.state.customerIdentities.street}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Kod pocztowy</label>
                        <input
                        type="text"
                        name="customerZipCode"
                        value={this.state.customerIdentities.zipCode}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    <div className="field">
                        <label>Miejscowość</label>
                        <input
                        type="text"
                        name="customerCity"
                        value={this.state.customerIdentities.city}
                        onChange={this.handleChange}
                        required></input>
                    </div>
                    </div>
                    <label className="error-message">{this.state.dataError}</label>
                    <button className="panel-button" form="updateData" onClick={this.handleUpdateData}>Edytuj dane</button>
                </form>
                <form id="updateCompany">
                    <div className="panel-form-container">
                        <div className="panel-form-header">Dane firmy:</div>
                        <div className="field">
                        <label>Nazwa firmy</label>
                        <input
                        type="text"
                        name="companyName"
                        value={this.state.companyIdentities.companyName}
                        onChange={this.handleChange}
                        ></input>
                    </div>
                    <div className="field">
                        <label>Adres</label>
                        <input
                        type="text"
                        name="companyStreet"
                        value={this.state.companyIdentities.companyStreet}
                        onChange={this.handleChange}
                        ></input>
                    </div>
                    <div className="field">
                        <label>Kod pocztowy</label>
                        <input
                        type="text"
                        name="companyZipCode"
                        value={this.state.companyIdentities.companyZipCode}
                        onChange={this.handleChange}
                        ></input>
                    </div>
                    <div className="field">
                        <label>Miejscowość</label>
                        <input
                        type="text"
                        name="companyCity"
                        value={this.state.companyIdentities.companyCity}
                        onChange={this.handleChange}
                        ></input>
                    </div>
                    <div className="field">
                        <label>NIP</label>
                        <input
                        type="text"
                        name="companyNIP"
                        value={this.state.companyIdentities.companyNIP}
                        onChange={this.handleChange}
                        ></input>
                    </div>
                    </div>
                    <label className="error-message">{this.state.companyError}</label>
                    <button className="panel-button" form="updateCompany" onClick={this.handleUpdateCompany}>Edytuj dane</button>
                </form>
                <button className="panel-button" onClick={this.handleDeleteCustomer}>USUŃ KLIENTA</button>

            </div></>
        )

        const renderCustomer = (

            <>{this.state.showData ? renderData : renderOrders}</>
        )
        return <div><div className="top-menu">
        <button id="data" onClick={this.handleMenu} className="top-menu-button button-active">DANE</button>
        <button id="orders" onClick={this.handleMenu} className="top-menu-button">ZAMÓWIENiA</button>
    </div>
            {this.state.isUpdated ? <Redirect push to="/admin/customers"/> : renderCustomer}</div>

    }
}

const mapStateToProps = (state) => {
    return { customer: state.customer, orders: state.orders };

};

export default connect(
    mapStateToProps,
    { getCustomer, updateCustomer, updateData, updateInvoice, getOrdersByClient, deleteCustomer }
    )(CustomerForm);