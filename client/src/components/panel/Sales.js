import React from 'react';
import { getOrders, getNewOrders, getOpenOrders, getFinalizedOrders, getStatuses, updateOrderStatus, getOrdersByQuery } from '../../actions';
import { connect } from 'react-redux';
import { Pages } from './Pages'
import {changeView, changeLocation, getCookie, getDate } from '../../js/index';
import { baseURL } from '../../api/index';


export function SelectStatus ({statuses, statusID}) {
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
            statusChanged: "",
            renderSite: false,
            loaded: false,
            queryError: '',
            ordersLength:0,
            orders: [],
            goToPage: '',
            currentPage: 1,
            overallPages: [],
            pageError:''
        }
    }
    async componentDidMount() {
        const jwt = getCookie("jwt")
        let status = this.props.match.params.byStatus
        let page = 1;
        if(this.props.match.params.pageNumber) {
            page = this.props.match.params.pageNumber
        }
        this.setState({currentPage: page});
        if(this.props.match.params.query) {
            await this.props.getOrdersByQuery(status, this.props.match.params.query, page, jwt)
            if(this.props.orders.length===0) {
                this.setState({queryError: `Brak wyników dla wyszukiwania "${this.props.match.params.query}"`})
            }        
        } else {
        if(status=="all") {
       await this.props.getOrders(page, jwt);
        } else if(status=="new") {
            await this.props.getNewOrders(page, jwt);
        } else if(status=="open") {
            await this.props.getOpenOrders(page, jwt);
        } else if(status==="finalized") {
            await this.props.getFinalizedOrders(page, jwt);
        }
    }
       await this.props.getStatuses(jwt);
       this.setState({orders: this.props.orders.orders})
       this.setState({ordersLength: this.props.orders.length})
       let array = [];
       if(this.state.ordersLength>0) {
       let toRound = this.state.ordersLength/20;
       let pages = Math.ceil(toRound);
       for(let i=0 ;i<pages;i++) {
           let x = i+1;
           array.push(x)
        }
        }
        if(this.props.match.params.query) {
            this.setState({query: this.props.match.params.query})
        }
       this.setState({overallPages: array})
       this.setState({loaded: true})
    }

    componentDidUpdate = async () => {
        
        if(this.state.renderSite===true) {
                window.location.reload(true);   
    }
    }

    handleChange = e => {
        switch(e.target.name) {
            case 'query':
                this.setState({query: e.target.value})
                break;
            case 'page':
                this.setState({goToPage: e.target.value})
                break;
            default:
                break;
        }
    }

    updateStatus = async event => {
        const jwt = getCookie("jwt")
        let statusID = event.target.options[event.target.options.selectedIndex].value;
            await this.props.updateOrderStatus(event.target.id, statusID, jwt);
        let element = document.getElementById("main-panel-container");
        let statusChanged = document.createElement("div")
        statusChanged.setAttribute("class", "status-changed");
        statusChanged.innerText=`${this.props.order}`;
        element.after(statusChanged);
        setTimeout(function() {
            statusChanged.remove()}, 2000)

        this.setState({renderSite: true})

        }


    renderTable = () => {
        
        return this.state.orders.map( order => {
            let value = changeView(order.value);
            let date = new Date(order.dateAdded);
            let stringDate = getDate(date);
            return (
                <tr id={order.ID}>
                    <td data-label="ID"><a href={`/admin/orders/show/details/${order.ID}`}>{order.ID}</a></td>
                    <td data-label="Kupujący"><a href={`/admin/orders/show/details/${order.ID}`}>{order.customerIdentities.name}</a></td>
                    <td data-label="Data złożenia">{stringDate}</td>
                    <td data-label="Metoda dostawy">{order.shipment.name}</td>
                    <td data-label="Płatność">{order.payment.name}</td>
                    <td data-label="Wartość">{value}</td>
                    <td data-label="Status">
                        <select id={order._id} onChange={this.updateStatus}>
                            <SelectStatus statuses={this.props.statuses} statusID={order.status.ID} key={order.status.ID}/>
                        </select>
                    </td>
                </tr>
            )
        })
    }


    renderHeader = () => {
        switch(this.props.match.params.byStatus) {
            case 'all':
                return(
                    <h2>Wszystkie zamówienia</h2>
                )
            case 'open':
                return (
                <h2>Otwarte zamówienia</h2>
                )
                
            case 'new':
                return(
                    <h2>Nowe zamówienia</h2>
                )
            case 'finalized':
                 return(
                    <h2>Zakończone zamówienia</h2>
                )
            default:
                break;

        }
        
    }
    handleSearchOrders = async e => {
        e.preventDefault();
        this.setState({queryError: ''})
        window.location.replace(`${baseURL}/admin/orders/${this.props.match.params.byStatus}/${this.state.query}`)
    }

    handleGoToPage = e => {
        e.preventDefault();
        let page = Number(this.state.goToPage);
        if(isNaN(page)) {
            return this.setState({pageError: "Podany znak musi być liczbą!"})
        }
        if(page > this.state.overallPages.length) {
            page = this.state.overallPages.length;
        }

        if(this.props.match.params.pageNumber) {
            let location = changeLocation(window.location.href)
            window.location.replace(`${location}/${page}`)
        } else {
        window.location.replace(`${window.location.href}/page/${page}`)
        }
        
    }
    
    render() {
        const renderSales = (
            <><div className="products-panel-header">
                    {this.renderHeader()}
                </div>
            <div className="products-navigation-header">
                
                    <form id="searchOrders">
                    <div className="ui icon input">
                    <input 
                    type="text" 
                    placeholder="Szukaj..."
                    name="query"
                    value={this.state.query}
                    onChange={this.handleChange}
                    />
                    <button form="searchOrders" onClick={this.handleSearchOrders}><i className="search icon"></i></button>
                    </div>
                    </form>
                            </div>
                            <div id=""className="ui relaxed divided list"><table id="table" className="ui celled table">
                                <thead>
                                <tr>
                                <th>ID</th>
                                <th>Kupujący</th>
                                <th>Data złożenia</th>
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
                    <Pages overallPages={this.state.overallPages} currentPage={this.state.currentPage} page={this.props.match.params.pageNumber}/>
                    <form id="page-number-form">
                        <input
                        className="page-number"
                        type="text"
                        onChange={this.handleChange}
                        name="page"
                        /><button className="panel-button" form="page-number-form" onClick={this.handleGoToPage}>Przejdź do strony</button>
                        <span>{this.state.pageError}</span>
                        </form>
                            <div>{this.state.queryError}</div></>

        )

        const loading = (
            <><div>Wczytywanie danych...</div></>
        )
        return(
            <div className="content-container">
                {this.state.loaded ? renderSales : loading}
            </div>
        )


    }
}

const mapStateToProps = state => {
    return { orders: state.orders, statuses: state.statuses, order: state.order };
};
export default connect(
    mapStateToProps,
    { getOrders, getNewOrders, getOpenOrders, getFinalizedOrders, getStatuses, updateOrderStatus, getOrdersByQuery }
)(Sales);