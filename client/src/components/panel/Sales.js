import React from 'react';
import { getOrders, getStatuses, updateOrderStatus } from '../../actions';
import { connect } from 'react-redux';
import {changeView } from '../../js/index';


function SelectStatus ({statuses, statusID}) {
    return statuses.map(status => {
        if(status.ID===statusID) {
        return (
            
            <option value={status.ID} selected>{status.name}</option>
        )} else {
            return (
                <option value={status.ID}>{status.name}</option>
            ) 
        }
    })
}

class Sales extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            statusChanged: ""
        }
    }
    async componentDidMount() {
       await this.props.getOrders();
       await this.props.getStatuses();
       this.setState({orders: this.props.orders})
    }

    updateStatus = async event => {
        let statusID = event.target.options[event.target.options.selectedIndex].value;
            await this.props.updateOrderStatus(event.target.id, statusID)
        this.setState({statusChanged: this.props.order})
        // let element = document.getElementById();
        // setTimeout(function() {this.setState.bind({statusChanged:''})}, 2000)
    }

    renderTable = () => {
        
        return this.props.orders.map( order => {
            let value = changeView(order.value);
            return (
                <tr id={order.ID}>
                    <td data-label="ID">{order.ID}</td>
                    <td data-label="Kupujący">{order.customerIdentities.name}</td>
                    <td data-label="Metoda dostawy">{order.shipment.name}</td>
                    <td data-label="Płatność">{order.payment.name}</td>
                    <td data-label="Wartość">{value}</td>
                    <td data-label="Status">
                        <select id={order._id} onChange={this.updateStatus}>
                            <SelectStatus statuses={this.props.statuses} statusID={order.status.ID} key={order.status.ID}/>
                        </select>
                        <span>{this.state.statusChanged}</span>
                    </td>
                </tr>
            )
        })
    }
    
    render() {
        return(
            <div className="content-container">
            <div className="products-navigation-header">
                <div className="ui icon input">
                    <input type="text" placeholder="Szukaj..."/>
                    <i className="search icon"></i>
                </div>            </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
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
            <span id="statusChanged"></span>
            </div>            
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { orders: state.orders, statuses: state.statuses, order: state.order };
};
export default connect(
    mapStateToProps,
    { getOrders, getStatuses, updateOrderStatus }
)(Sales);