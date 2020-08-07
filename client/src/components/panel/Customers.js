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
            // query: '',
            // searchError: '',
            loaded: false,
            productsLength: 0,
            overallPages: [],
            currentPage: 1,
            // categories: [],
            // categoryFilter: '',
            // sortFilter:'',
            // priceA: '',
            // priceB: '',
            // checked: [],
            // actionChoosen: '',
            // valueToChange: '',
            // actionError:''
        }
    }
    async componentDidMount() {
        const jwt = getCookie('jwt');
        let page = 1;
        
        if(this.props.match.params.pageNumber) {
            page = this.props.match.params.pageNumber
        }
        this.setState({currentPage: page});
        // if(this.props.match.params.query) {
        //     await this.props.getProductsByQuery(this.props.match.params.query, page)
        //     if(this.props.products.length===0) {
        //         this.setState({searchError: `Brak produktów dla wyszukiwania ${this.props.match.params.query}, sprawdź czy poprawnie wpisujesz wyszukiwanie.`})
        //     }
        //     this.setState({query: this.props.match.params.query})

        // } else if(this.props.match.params.active) {
        //     const { categoryId, priceA, priceB} = this.props.match.params
        //     await this.props.getProductsByFilters(categoryId, priceA, priceB, page)
        //     if(this.props.products.length===0) {
        //         this.setState({searchError: `Brak produktów dla podanych filtrów.`})
        //     }
        //     if(priceA!=0) {
        //         this.setState({priceA: priceA});
        //     }
        //     if(priceB!=0) {
        //         this.setState({priceB: priceB});
        //     }
        //     if(categoryId!="all") {
        //     this.setState({categoryFilter: categoryId})
        //     }


        // } else if(this.props.match.params.sortValue) {
        //     await this.props.sortProducts(this.props.match.params.sortValue, page)
        // }
        // else { await this.props.getProducts(page); 
        // }
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
        // await this.props.getCategories();
        // this.setState({categories: this.props.categories})
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


    // handleFilter = async e => {
    //     e.preventDefault();
    //     let categoryId="category=all/";
    //     // let priceA="pricefrom=0/";
    //     let priceA=this.state.priceA;
    //     let priceB=this.state.priceB;
    //     // let priceB="priceto=0/";
    //     if(this.state.categoryFilter!=''){
    //         categoryId=`category=${this.state.categoryFilter}/`
    //     }
    //     if(this.state.priceA==='') {
    //         priceA=0
    //     }
    //     if(this.state.priceB==='') {
    //         priceB=0
    //     }

    //     // if(this.state.priceA!=0) {
    //     //     priceA=`pricefrom=${this.state.priceA}/`
    //     // }
    //     // if(this.state.priceB!=0) {
    //     //     priceB=`priceto=${this.state.priceB}/`
    //     // }
    //     window.location.replace(`${baseURL}/admin/products/filter/active/${categoryId}pricefrom=${priceA}/priceto=${priceB}`)
    // }

    // handleSort = async e => {
    //     e.preventDefault();
    //     console.log(this.state.sortFilter)
    //     if(this.state.sortFilter==='') {
    //         return window.location.replace(`${baseURL}/admin/products`)
    //     }
    //     window.location.replace(`${baseURL}/admin/products/sort/${this.state.sortFilter}`)

    // }

    // handleManyActions = async e => {
    //     e.preventDefault();
    //     switch(this.state.actionChoosen) {
    //         case 'delete':
    //             this.state.checked.map(async element => {
    //                 await this.props.deleteProduct(element)
    //             })
    //         break;
    //         case 'change-price':
    //             if(this.state.valueToChange==='' || isNaN(this.state.valueToChange)) {
    //                 return this.setState({actionError: "Musisz podać liczbę"})
    //             } else if(this.state.valueToChange <= 0) {
    //                 return this.setState({actionError: "Cena musi być większa od 0"})
    //             } else {
    //                 this.state.checked.map(async element => {
    //                 try {await this.props.updatePrice(element, this.state.valueToChange)
    //                 this.setState({message:this.props.product.message})}
                    
    //                 catch(err) {
    //                     await this.setState({message: "Coś poszło nie tak"})
    //                 }
    //                 let root = document.getElementById("root");
    //                 let statusChanged = document.createElement("div")
    //                 statusChanged.setAttribute("class", "status-changed");
    //                 statusChanged.innerText=`${this.state.message}`;
    //                 root.after(statusChanged);
    //                 setTimeout(function() {
    //                     statusChanged.remove()}, 2000)
    //                 });
    //             }
    //         break;
    //         case 'change-stock':
    //             if(this.state.valueToChange==='' || isNaN(this.state.valueToChange)) {
    //                 return this.setState({actionError: "Musisz podać liczbę"})
    //             } else if(this.state.valueToChange < 0) {
    //                 return this.setState({actionError: "Stan magazynowy nie może być ujemny"})
    //             }
    //             this.state.checked.map(async element => {
    //                 try {
    //                     await this.props.updateStock(element, this.state.valueToChange)
    //                     this.setState({message:this.props.product.message})
    //                 } catch(err) {
    //                     await this.setState({message: "Coś poszło nie tak"})
    //                 }
    //                 let root = document.getElementById("root");
    //                 let statusChanged = document.createElement("div")
    //                 statusChanged.setAttribute("class", "status-changed");
    //                 statusChanged.innerText=`${this.state.message}`;
    //                 root.after(statusChanged);
    //                 setTimeout(function() {
    //                     statusChanged.remove()}, 2000)
    //                 });
    //         break;
    //         default:
    //         this.setState({actionError: "Musisz wybrać akcję"})
    //     }
        
    //     // window.location.reload();
    // }
    
    render() {

        // const renderInput = (
        //     <input
        //     type="text"
        //     name="value-to-change"
        //     placeholder="Podaj wartość..."
        //     onChange={this.handleChange}
        //     />
        // )
        
        // const manyActions = (
        //     <div className="many-actions">
        //         <select name="choose-action" onChange={this.handleChange}>
        //             <option value="">Wybierz akcję</option>
        //             <option value="delete">Usuń</option>
        //             <option value="change-price">Zmień cenę</option>
        //             <option value="change-stock">Zmień stan magazynowy</option>
        //         </select>
        //         {this.state.actionChoosen==="change-price" || this.state.actionChoosen==="change-stock" ? renderInput : null}
        //         <button className="panel-button" onClick={this.handleManyActions}>Wykonaj</button>
        //         {this.state.actionError}
        //     </div>
        // )
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
                {/* <div className="filter-bar">
                    <select
                    name="category-filter"
                    onChange={this.handleChange}>
                        <option value="">Kategoria</option>
                        {this.renderCategories()}
                    </select>
                    <label>Cena od</label><input
                    type="text"
                    name="priceA"
                    value={this.state.priceA}
                    onChange={this.handleChange}
                    />
                    <label>do</label>
                    <input
                    type="text"
                    name="priceB"
                    value={this.state.priceB}
                    onChange={this.handleChange}
                    />
                <button onClick={this.handleFilter} className="panel-button">Filtruj</button>
                </div> */}
                {/* <div className="sort-bar">
                    <select
                    name="sort-filter"
                    onChange={this.handleChange}
                    >
                    <option value="">Domyślnie - data dodania</option>
                    <option value="price">Cena rosnąco</option>
                    <option value="-price">Cena malejąco</option>
                    <option value="name">Nazwa rosnąco</option>
                    <option value="-name">Nazwa malejąco</option>
                    <option value="numberInStock">Stan magazynowy rosnąco</option>
                    <option value="-numberInStock">Stan magazynowy malejąco</option>
                    </select>
                    <button onClick={this.handleSort} className="panel-button">Sortuj</button>
                </div>
                {this.state.checked.length>0 ? manyActions : null} */}
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