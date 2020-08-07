import React from 'react';
import { connect } from 'react-redux';
import { getOrder, getStatuses, updateOrderStatus, orderMessage, updatePrivateComment, updateMessages } from "../../actions";
import { changeView, getCookie, getDate } from "../../js"
import { SelectStatus } from './Sales';



class OrderDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state= {
            _id: '',
            customerIdentities: {},
            shipmentIdentities: {},
            invoiceIdentities: {},
            customer: {},
            shipment: {},
            payment: {},
            ID: '',
            value: '',
            products: [],
            status: {},
            invoice: false,
            statuses: [],
            comment:'',
            privateComment: '',
            message: '',
            messages: [],
            discountActive: false,
            dateAdded: ''

        }
    }

    componentDidMount = async () => {
        const jwt = getCookie("jwt");
        await this.props.getOrder(this.props.match.params.id, jwt);
        await this.props.getStatuses(jwt);
        this.setState({status: this.props.order.status})
        await this.setState({statuses: this.props.statuses})
        this.setState({customerIdentities: this.props.order.customerIdentities});
        this.setState({shipmentIdentities: this.props.order.shipmentIdentities});
        this.setState({products: this.props.order.products})
        this.setState({shipment: this.props.order.shipment});
        this.setState({payment: this.props.order.payment});
        let changedShipmentPrice = changeView(this.state.shipment.price);
        this.setState({changedShipmentPrice: changedShipmentPrice});
        this.setState({value: this.props.order.value});
        let changedOrderValue = changeView(this.state.value);
        this.setState({changedOrderValue: changedOrderValue});
        this.setState({comment: this.props.order.comment});
        this.setState({privateComment: this.props.order.privateComment});
        this.setState({messages: this.props.order.messages});
        if(this.props.order.invoiceIdentities.companyName!=="") {
            this.setState({invoice: true});
            this.setState({invoiceIdentities: this.props.order.invoiceIdentities});
        }
        this.setState({discountActive: this.props.order.discountActive});
        this.setState({discountUsed: this.props.order.discountUsed});
        this.setState({_id: this.props.order._id});
        this.setState({ID: this.props.order.ID})
        let date = new Date(this.props.order.dateAdded);
        let stringDate = getDate(date);
        this.setState({dateAdded: stringDate})
        
        this.setState({customer: this.props.order.customer})
        
    }

    updateStatus = async event => {
        const jwt = getCookie("jwt")
        let statusID = event.target.options[event.target.options.selectedIndex].value;
            await this.props.updateOrderStatus(event.target.id, statusID, jwt);
        let element = document.getElementById("root");
        let statusChanged = document.createElement("div")
        statusChanged.setAttribute("class", "status-changed");
        statusChanged.innerText=`${this.props.order}`;
        element.after(statusChanged);
        setTimeout(function() {
            statusChanged.remove()}, 2000)
        }

    renderProducts(products) {

        return products.map(product => {
            let newPrice = changeView(product.price);
            let value = changeView(product.price * product.amount);
            let color = '';
            let variant = '';
            if(product.color!=='') {
                color="Kolor: " + product.color
            }
            if(product.variantValue!=='') {
                color= product.variantName + ": " + product.variantValue
            }

            return (
                <tr className="product-row">
                    <td data-label="Nazwa Produktu"><a href={`/admin/products/edit/${product.ID}`} target="_blank">{product.name}</a><br/><span style={{fontSize:"16px"}}>{color}</span><br/><span style={{fontSize:"16px"}}>{variant}</span></td>
                    <td data-label="Ilość">{product.amount}</td>
                    <td style={{textAlign: "center"}}data-label="Cena">{newPrice}</td>
                    <td data-label="Wartość">{value}</td>
                </tr>
            )
        })
    }

    handleChange = event => {
        switch (event.target.name) {
            case 'message':
               this.setState({ message: event.target.value });
                break;
            case 'privateComment':
                this.setState({privateComment: event.target.value});
                break;
            case 'waybill':
                this.setState({ waybill: event.target.value });
                break;
            case 'shipmentCompany':
                this.setState({ shipmentCompany: event.target.value});
                break;
            default:
                break;
        }
    };

    handleEditPrivCom = e => {
        e.preventDefault();
        let textarea = document.getElementById("privateCommentArea");
        textarea.removeAttribute("readonly");
        textarea.style.backgroundColor="white"
        let editButton = document.getElementById("privComEditBut");
        editButton.style.display="none";
        let addButton = document.getElementById("privComAddBut");
        addButton.style.display="block";
    }

    handleAddPrivCom = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        await this.props.updatePrivateComment(this.state.ID, this.state.privateComment, jwt);
        let textarea = document.getElementById("privateCommentArea");
        textarea.setAttribute("readonly", "true");
        textarea.style.backgroundColor="lightgray"
        let editButton = document.getElementById("privComEditBut");
        editButton.style.display="block";
        let addButton = document.getElementById("privComAddBut");
        addButton.style.display="none";
        let element = document.getElementById("root");
        let statusChanged = document.createElement("div")
        statusChanged.setAttribute("class", "status-changed");
        statusChanged.innerHTML=this.props.order;
        element.after(statusChanged);
        setTimeout(function() {
            statusChanged.remove()}, 2000)
        }

        renderMessages = () => {
            return this.state.messages.map( message => {
                return (
                    <div className="customer-message-container">
                        <div className="field-message">
                            <label className="message-label">Treść wiadomości</label>
                            <textarea 
                            rows="5" 
                            cols="50" 
                            value={message.comment}
                            readonly="true"
                            ></textarea>
                        </div>
                        <div className="field-message">
                            <label className="message-label">Numer listu przewozowego</label>
                            <input 
                            value={message.waybill}
                            type="text" 
                            readonly="true"></input>
                        </div>
                        <div className="field-message">
                            <label className="message-label">Firma kurierska</label>
                            <input 
                            value={message.shipmentCompany}
                            type="text"
                            readonly="true"
                            />
                        </div>
                    </div>
                )
            })
        }
        

    sendMessage = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        const data = {
            message: this.state.message,
            waybill: this.state.waybill,
            shipmentCompany: this.state.shipmentCompany,
            orderId: this.state.ID
        }
        if(data.message==='' || data.message===undefined) { return this.setState({messageError: "Pole wiadomość nie moze być puste"})}
        if(data.waybill==='' || data.waybill===undefined) { return this.setState({messageError: "Podaj numer listu"})}
        if(data.shipmentCompany==='' || data.shipmentCompany===undefined) { return this.setState({messageError: "Wybierz przewoźnika"})}

        await this.props.orderMessage(this.state.customerIdentities.email, data, jwt )
        this.setState({messageError:''})

        await this.props.updateMessages(this.state.ID, this.state.message, this.state.waybill, this.state.shipmentCompany, jwt);
        

            let element = document.getElementById("root");
        let statusChanged = document.createElement("div")
        statusChanged.setAttribute("class", "status-changed");
        statusChanged.innerHTML="Wysłano";
        element.after(statusChanged);
        setTimeout(function() {
            statusChanged.remove()}, 2000)
        }

    render() {

        const renderInvoice = (
            <div className="order-identities">
                <table>
                                <tr>
                                    <td>Nazwa firmy: </td>
                                    <td className="order-identities-data">{this.state.invoiceIdentities.companyName}</td>
                                </tr>
                                <tr>
                                    <td>Adres: </td>
                                    <td className="order-identities-data">{this.state.invoiceIdentities.street}</td>
                                </tr>
                                <tr>
                                    <td>Kod i miejscowość: </td>
                                    <td className="order-identities-data">{this.state.invoiceIdentities.zipCode} {this.state.invoiceIdentities.city}</td>
                                </tr>
                                <tr>
                                    <td>Numer NIP: </td>
                                    <td className="order-identities-data">{this.state.invoiceIdentities.NIP}</td>
                                </tr>
                            </table>
            </div>
        )

        const noInvoice = (
            <div className="order-identities">
                <div>Nie wybrano</div>
            </div>
        )

        const customer = (
            <div>Kupujący: <a href={`/admin/customers/edit/${this.state.customer._id}`} target="_blank">{this.state.customer.login}</a></div>
        )

        return (
            
            <div className="details-container">
                <div className="products-container">
                    <div className="products-list">Zamówienie nr {this.props.match.params.id}</div>
                    {!this.state.customer.login ? <div>Kupujący: Niezarejestrowany</div> : customer}
                    <div>Data złożenia: {this.state.dateAdded}</div>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Nazwa produktu</th>
                                <th>Ilość</th>
                                <th style={{textAlign: "center"}}>Cena</th>
                                <th>Wartość</th>
                            </tr>
                        </thead>
                        <tbody className="products-table-body">
                            {this.renderProducts(this.state.products)}
                            <tr>
                                <td className="table-shipment"colspan="2">Metoda Dostawy:</td>
                            <td className="table-shipment-name">{this.state.shipment.name}</td>
                            <td className="table-price">{this.state.changedShipmentPrice}</td>
                            </tr>
                            <tr>
                                <td className="order-label-method"colspan="2">Metoda płatności:</td>
                                <td className="table-payment" colspan="2">{this.state.payment.name}</td>
                            </tr>
                            {this.state.discountActive ? <tr>
                                <td className="order-label-method"colspan="3"><b>Kod rabatowy: {this.state.discountUsed}</b></td>
                            </tr> : null }
                            <tr>
                                <td className="order-label-method"colspan="3">Wartość zamówienia:</td>
                                <td className="table-price"><b>{this.state.changedOrderValue} zł</b></td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
                <div className="order-identities-container">
                    <div className="order-customer-identities identities-item">
                        <div className="order-identities-label">Dane kupującego:</div>
                        <div className="order-identities">
                            <table>
                                <tr>
                                    <td>Imię i nazwisko: </td>
                                    <td className="order-identities-data">{this.state.customerIdentities.name}</td>
                                </tr>
                                <tr>
                                    <td>Adres e-mail:</td>
                                    <td className="order-identities-data">{this.state.customerIdentities.email}</td>
                                </tr>
                                <tr>
                                    <td>Adres: </td>
                                    <td className="order-identities-data">{this.state.customerIdentities.street}</td>
                                </tr>
                                <tr>
                                    <td>Kod i miejscowość: </td>
                                    <td className="order-identities-data">{this.state.customerIdentities.zipCode} {this.state.customerIdentities.city}</td>
                                </tr>
                                <tr>
                                    <td>Telefon: </td>
                                    <td className="order-identities-data">{this.state.customerIdentities.telephone}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="order-shipment-identities identities-item">
                        <div className="order-identities-label">Dane do wysyłki:</div>
                        <div className="order-identities">
                        <table>
                                <tr>
                                    <td>Imię i nazwisko: </td>
                                    <td className="order-identities-data">{this.state.shipmentIdentities.name}</td>
                                </tr>
                                <tr>
                                    <td>Adres: </td>
                                    <td className="order-identities-data">{this.state.shipmentIdentities.street}</td>
                                </tr>
                                <tr>
                                    <td>Kod i miejscowość: </td>
                                    <td className="order-identities-data">{this.state.shipmentIdentities.zipCode} {this.state.shipmentIdentities.city}</td>
                                </tr>
                                <tr>
                                    <td>Telefon: </td>
                                    <td className="order-identities-data">{this.state.shipmentIdentities.telephone}</td>
                                </tr>
                            </table>
                        </div>
                        
                    </div>
                    <div className="order-invoice-identities identities-item">
                        <div className="order-identities-label">Dane do faktury:</div>
                        {this.state.invoice ? renderInvoice : noInvoice}
                    </div>
                    <div className="order-status">
                    <div className="order-identities-label">Status zamówienia:</div>
                    <select id={this.state._id} onChange={this.updateStatus}>
                        <SelectStatus statuses={this.state.statuses} statusID={this.state.status.ID}/>
                    </select>
                    </div>                    
                </div>
                <div className="order-comment-container">
                        <h3>Uwagi do zamówienia:</h3>
                        <div>{this.state.comment==='' ? <p>Brak</p>: this.state.comment}</div>
                </div>

                <div className="order-private-comment">
                        <h3>Prywatne uwagi:</h3>
                        <textarea id="privateCommentArea"
                        cols="50"
                        rows="5"
                        value={this.state.privateComment}
                        name="privateComment"
                        onChange={this.handleChange}
                        readonly="true"/>
                        <button id="privComEditBut"className="panel-button" onClick={this.handleEditPrivCom}>EDYTUJ</button>
                        <button id="privComAddBut"className="panel-button" onClick={this.handleAddPrivCom}>ZAPISZ</button>
                </div>
                <span className="error-message">{this.state.messageError}</span>

                <div className="customer-message-container">
                    <form id="sendMessage">
                        <div className="field-message">
                            <label className="message-label">Treść wiadomości</label>
                            <textarea 
                            rows="5" 
                            cols="50" 
                            name="message"
                            onChange={this.handleChange}
                            required></textarea>
                        </div>
                        <div className="field-message">
                            <label className="message-label">Numer listu przewozowego</label>
                            <input 
                            type="text" 
                            name="waybill"
                            onChange={this.handleChange}
                            required></input>
                        </div>
                        <div className="field-message">
                            <label className="message-label">Firma kurierska</label>
                            <select 
                            name="shipmentCompany"
                            onChange={this.handleChange}
                            required>
                                <option value="" selected>Wybierz przewoźnika</option>
                                <option value="DPD">DPD</option>
                                <option value="InPost">InPost</option>
                                <option value="Geis">Geis</option>
                                <option value="DHL">DHL</option>
                                <option value="Paczka w Ruchu">Paczka w Ruchu</option>
                                <option value="UPS">UPS</option>
                                <option value="Pocztex">Pocztex</option>
                                <option value="Fedex">Fedex</option>
                                <option value="Poczta Polska">Poczta Polska</option>
                            </select>
                        </div>
                        <div className="field-message button-for-sendmessage">
                            <button form="sendMessage" className="panel-button" onClick={this.sendMessage}>Wyślij wiadomość</button>
                        </div>
                    </form>
                </div>
                {this.state.messages.length>0 ? <div className="order-messages">
                    <h4>Wiadomości wysłane</h4>
                {this.renderMessages()}
                </div> : null}
                

            </div>

        )
    }
}

const mapStateToProps = state => {
    return { order: state.order, statuses: state.statuses, mail: state.mail };
};
export default connect(
    mapStateToProps,
    { getOrder, getStatuses, updateOrderStatus, orderMessage, updatePrivateComment, updateMessages }
)(OrderDetails);

