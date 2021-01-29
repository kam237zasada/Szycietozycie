import React from 'react';
import { getCustomers, getCustomersByQuery } from '../../actions';
import { connect } from 'react-redux';
import { Pages } from './Pages';
import {changeView, getCookie } from '../../js/index';
import { baseURL } from '../../api/index';


class Customers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            loaded: false,
            productsLength: 0,
            overallPages: [],
            currentPage: 1,
        }
    }
    async componentDidMount() {
        const jwt = getCookie('jwt');
        let page = 1;
        
        if(this.props.match.params.pageNumber) {
            page = this.props.match.params.pageNumber
        }
        this.setState({currentPage: page});
        if(this.props.match.params.query) {
            await this.props.getCustomersByQuery(this.props.match.params.query, page, jwt)
            if(this.props.customers.length===0) {
                this.setState({searchError: `Brak klientów dla wyszukiwania ${this.props.match.params.query}, sprawdź czy poprawnie wpisujesz wyszukiwanie.`})
            }
            this.setState({query: this.props.match.params.query})
        } else { await this.props.getCustomers(page, jwt) }

        
       this.setState({customers: this.props.customers.customers})
       this.setState({productsLength: this.props.customers.length})
       let array = [];
       if(this.state.productsLength>0) {
       let toRound = this.state.productsLength/20;
       let pages = Math.ceil(toRound);
       for(let i=0 ;i<pages;i++) {
           let x = i+1;
           array.push(x)
        }
        }
       this.setState({overallPages: array})
       this.setState({loaded: true})
    }

    handleChange = async e => {
        switch(e.target.name) {
            case 'query':
                this.setState({query: e.target.value})
                break;
            case 'page':
                this.setState({goToPage: e.target.value})
                break;
            case 'category-filter':
                this.setState({categoryFilter: e.target.value})
                break;
            case 'priceA':
                this.setState({priceA: e.target.value})
                break;
            case 'priceB':
                this.setState({priceB: e.target.value})
                break;
            case 'sort-filter':
                this.setState({sortFilter: e.target.value})
                break;
            case 'check-product':
                this.setState({actionError: ""})
                if(e.target.checked===true) {
                    let checked = this.state.checked;
                    checked.push(e.target.id)
                    this.setState({checked: checked})
                } else {
                    let checked = this.state.checked;
                     checked.map((element, index) => {
                        if(e.target.id===element) {
                            checked.splice(index, 1)
                            if(checked.length===0) {
                                this.setState({actionChoosen: ''})
                                this.setState({valueToChange: ''})

                            }
                             this.setState({checked: checked})
                        }
                    })
                }
                break;
            case 'choose-action':
                this.setState({actionError: ''})
                this.setState({actionChoosen: e.target.value})
                break;
            case 'value-to-change':
                this.setState({actionError: ''})
                this.setState({valueToChange: e.target.value})
            default:
                break;
        }
    }

    renderTable = () => {
        return this.state.customers.map( customer => {
            return (
                <tr>
                    <td data-label="Login"><a href={`/admin/customers/edit/${customer._id}`}>{customer.login}</a></td>
                    <td data-label="Email">{customer.email}</td>
                    <td data-label="Imię i nazwisko">{customer.customerIdentities.name}</td>
                    <td data-label="Akcje"><a href={`/admin/customers/edit/${customer._id}`}><button className="panel-button">EDYTUJ</button></a></td>
                </tr>
            )
        })
    }


    handleSearchProducts = async e => {
        e.preventDefault();
        this.setState({queryError: ''})
        window.location.replace(`${baseURL}/admin/customers/search/${this.state.query}`)
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

        if(this.props.match.params.query) {
            window.location.replace(`${baseURL}/admin/customers/search/${this.props.match.params.query}/page/${page}`)
        } else {
        window.location.replace(`${baseURL}/admin/customers/page/${page}`)
        }        
    }    


    
    
    render() {

        const renderProducts = (
            <><div className="products-navigation-header">
                <form id="searchOrders">
                    <div className="ui icon input">
                    <input 
                    type="text" 
                    placeholder="Szukaj..."
                    name="query"
                    value={this.state.query}
                    onChange={this.handleChange}
                    />
                    <button form="searchOrders" onClick={this.handleSearchProducts}><i className="search icon"></i></button>
                    </div>
                    </form>            
                </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr>
            <th>Login</th>
            <th>Email</th>
            <th>Imię i nazwisko</th>
            <th>Akcje</th>
            </tr></thead>
            <tbody>
                {this.renderTable()}
            </tbody>
            </table>
            {this.state.searchError}
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
                {this.state.loaded ? renderProducts : loading}
                       
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { customers: state.customers };
};
export default connect(
    mapStateToProps,
    { getCustomers, getCustomersByQuery }
)(Customers);