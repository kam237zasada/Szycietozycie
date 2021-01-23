import React from 'react';
import { connect } from 'react-redux';
import { getSingleOrder } from '../actions/index';
import { getCookie, changeView, getDate } from '../js/index';
import ShopMenu from './ShopMenu';


class SingleOrder extends React.Component {

    constructor(props) {
        super(props)    
        this.state= {
            noOrders: '',
            orders: [],
            order: [],
            orderID: '',
            showDetails: false
        }    
    }

    componentDidMount = async () => {
        
        try {
        await this.props.getSingleOrder(this.props.match.params.accessToken);
        this.setState({orders: this.props.order})
        this.setState({orderID: this.props.order.ID})

        } catch (error) {
            return console.log(error);
        }
    
    }

    handleDetails = e => {
        let row = document.getElementById(`details-${e.target.id}`);
        let isFolded = row.getAttribute("data-folded")
        if(isFolded==="true") {
            row.style.display="table-row";
            row.setAttribute("data-folded", "false")
        } else {
            row.style.display="none";
            row.setAttribute("data-folded", "true")
        }


    }
    getProducts(products) {
        return products.map(product => {
            let newPrice = changeView(product.price);
            let value = product.price * product.amount;
            let newValue = changeView(value);
            return (
                <tr>
                    <td>{product.name}</td>
                    <td>{product.amount} szt</td>
                    <td>{newPrice} zł</td>
                    <td className="order-details-products-price">{newValue} zł</td>
                </tr>
                    
                
            )
        })
    }

    getTable = () => {

        return this.state.orders.map(order => {
            let newValue = changeView(order.value);
            let newShipmentPrice = changeView(order.shipment.price);
            let newOrderValue = changeView(order.value);
            let date = new Date(order.dateAdded);
            let dateString = getDate(date);

            const invoice = (
                <table className="order-details-table">
                                <tr>
                                    <td>Nazwa firmy</td>
                                    <td>{order.invoiceIdentities.companyName}</td>
                                </tr>
                                <tr>
                                    <td>Adres:</td>
                                    <td>{order.invoiceIdentities.street}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>{order.invoiceIdentities.zipCode} {order.invoiceIdentities.city}</td>
                                </tr>
                                <tr>
                                    <td>NIP:</td>
                                    <td>{order.invoiceIdentities.NIP}</td>
                                </tr>
                            </table>
            )

            return(
                <><tr id={order._id}>
                    <td data-label="Numer zamówienia">{order.ID}</td>
                    <td data-label="Data złożenia">{dateString}</td>
                    <td data-label="Wartość">{newValue}</td>
                    <td data-label="Aktualny status">{order.status.name}</td>
                    <td data-label="Szczegóły"><i className="fas fa-angle-down fold-details" id={order._id} onClick={this.handleDetails}></i></td>
                </tr>
                <tr data-folded="true" id={`details-${order._id}`} className="order-details-fold">
                <td colspan="5">
                    <div className="order-details-container">
                        <div className="order-details-customer">
                            <h5>Dane klienta:</h5>
                            <table className="order-details-table">
                                <tr>
                                    <td>Imię i nazwisko</td>
                                    <td>{order.customerIdentities.name}</td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td>{order.customerIdentities.email}</td>
                                </tr>
                                <tr>
                                    <td>Adres:</td>
                                    <td>{order.customerIdentities.street}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>{order.customerIdentities.zipCode} {order.customerIdentities.city}</td>
                                </tr>
                                <tr>
                                    <td>Telefon:</td>
                                    <td>{order.customerIdentities.telephone}</td>
                                </tr>
                            </table>
                        </div>
                        <div className="order-details-shipment">
                        <h5>Dane wysyłki:</h5>
                            <table className="order-details-table">
                                <tr>
                                    <td>Imię i nazwisko</td>
                                    <td>{order.shipmentIdentities.name}</td>
                                </tr>
                                <tr>
                                    <td>Adres:</td>
                                    <td>{order.shipmentIdentities.street}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>{order.shipmentIdentities.zipCode} {order.shipmentIdentities.city}</td>
                                </tr>
                                <tr>
                                    <td>Telefon:</td>
                                    <td>{order.shipmentIdentities.telephone}</td>
                                </tr>
                                <tr>
                                    <td>Metoda płatności:</td>
                                    <td>{order.payment.name}</td>
                                </tr>
                                <tr>
                                    <td>Metoda dostawy:</td>
                                    <td>{order.shipment.name}</td>
                                </tr>
                            </table>
                        </div>
                        {/* <div className="order-details-invoice">
                        <h5>Dane do faktury:</h5>
                        {order.invoiceIdentities.companyName!="" ? invoice : <div>Nie wybrano</div>}
                        </div> */}
                        <div className="order-details-products">
                        <h5>Zamawiane produkty:</h5>
                        <table>
                            <tr>
                                <td>Nazwa</td>
                                <td>Ilość</td>
                                <td>Cena</td>
                                <td>Wartość</td><br/>
                            </tr>
                            {this.getProducts(order.products)}
                            <tr className="details-shipment">
                                <td colspan="3">Koszt dostawy:</td>
                                <td className="order-details-products-price">{newShipmentPrice} zł</td>
                            </tr>
                            <tr className="details-value">
                                <td colspan="3">Razem:</td>
                                <td className="order-details-products-price">{newOrderValue} zł</td>
                            </tr>
                        </table>
                        </div> 
                        <div className="order-comment">
                            <h5>Uwagi do zamówienia:</h5>
                            {order.comment==='' ? <p>Brak</p> : <p>{order.comment}</p>}</div>                 
                    </div>
                </td>
            </tr></>     
            )
        })
    }

    render() {

        return(
        <div className="shop-content"><ShopMenu/>
        <div className="customer-orders-container">
            <h2>Twoje zamówienie numer: {this.state.orderID}</h2>
            {this.state.noOrders}
            <table className="orders-customer-table">
                <thead>
                    <tr>
                        <th>Numer zamówienia</th>
                        <th>Data złożenia</th>
                        <th>Wartość</th>
                        <th>Aktualny status</th>
                        <th>Szczegóły</th>
                    </tr>
                </thead>
                <tbody>
                    {this.getTable()}
                </tbody>
            </table>

        </div>
        </div>
        )
    }

}
const mapStateToProps = (state) => {
    return { orders: state.orders, order: state.order };
};

export default connect(
    mapStateToProps,
    { getSingleOrder }
    )(SingleOrder);