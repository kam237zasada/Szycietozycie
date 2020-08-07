import React from 'react';
import { getProducts, deleteProduct, getProduct, getProductsByQuery, getProductsByFilters, sortProducts, updatePrice, updateStock, getCategories } from '../../actions';
import { connect } from 'react-redux';
import { Pages } from './Pages';
import {changeView, getCookie, getDate } from '../../js/index';
import { baseURL } from '../../api/index';


class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            query: '',
            searchError: '',
            loaded: false,
            productsLength: 0,
            overallPages: [],
            currentPage: 1,
            categories: [],
            categoryFilter: '',
            sort:'',
            priceA: '',
            priceB: '',
            checked: [],
            actionChoosen: '',
            valueToChange: '',
            actionError:'',
            
        }
    }
    async componentDidMount() {
        let page = 1;
        if(this.props.match.params.pageNumber) {
            page = this.props.match.params.pageNumber
        }
        this.setState({currentPage: page});
        let sort = this.props.match.params.sortValue
        if(!sort) {
            sort = "-dateAdded"
        }
        this.setState({sortValue: sort})
        let priceA = this.props.match.params.priceA
        let priceB = this.props.match.params.priceB
        if(!priceA) { priceA = 0}
        if(!priceB ) { priceB = 0}
        let query = this.props.match.params.query;
        if(!query) {
            query = "allProducts"
        }
        if(query!="allProducts") {
        this.setState({query: query})
        }
        let categoryId = this.props.match.params.categoryId;
        if(!categoryId) {
            categoryId = "all"
        }

        if(this.props.match.params.active) {
            await this.props.getProductsByFilters(query, categoryId, priceA, priceB, sort, page)
            if(this.props.products.length===0) {
                this.setState({searchError: `Brak produktów dla podanych filtrów.`})
            }
            if(priceA!=0) {
                this.setState({priceA: priceA});
            }
            if(priceB!=0) {
                this.setState({priceB: priceB});
            }
            if(categoryId!="all") {
            this.setState({categoryFilter: categoryId})
            if(query!="") {
                this.setState({query: query})
            }
            }


        } else { await this.props.getProducts(priceA, priceB, sort, page); 
        }
       this.setState({products: this.props.products.products})
       this.setState({productsLength: this.props.products.length})
       let array = [];
       if(this.state.productsLength>0) {
       let toRound = this.state.productsLength/20;
       let pages = Math.ceil(toRound);
       for(let i=0 ;i<pages;i++) {
           let x = i+1;
           array.push(x)
        }
        }
        await this.props.getCategories();
        this.setState({categories: this.props.categories})
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
        return this.state.products.map( product => {
            let newPrice = changeView(product.price);
            return (
                <tr>
                    <td data-label=""><input onChange={this.handleChange} name="check-product" id={product._id} type="checkbox"/></td>
                    <td data-label="Produkt"><a href={`/admin/products/edit/${product.ID}`}>{product.name}</a></td>
                    <td data-label="Magazyn">{product.numberInStock}</td>
                    <td data-label="Kod produktu">{product.productCode}</td>
                    <td data-label="Cena">{newPrice}</td>
                    <td data-label="Akcje"><a href={`/admin/products/edit/${product.ID}`}><button className="panel-button">EDYTUJ</button></a></td>
                </tr>
            )
        })
    }


    handleSearchProducts = async e => {
        e.preventDefault();
        this.setState({queryError: ''})
        const { active, categoryId, priceA, priceB, sortValue} = this.props.match.params;
        let query = this.state.query;
        
        if(active) {
            if(this.state.query=="") {
                query="allProducts"
            }
            if(categoryId && sortValue) {
                window.location.replace(`${window.location.origin}/admin/products/filter/${active}/search=${query}/category=${categoryId}/pricefrom=${priceA}/priceto=${priceB}/sort=${sortValue}`)
            } else if(categoryId) {
                window.location.replace(`${window.location.origin}/admin/products/filter/${active}/search=${query}/category=${categoryId}/pricefrom=${priceA}/priceto=${priceB}`)
            } else if(sortValue) {
                window.location.replace(`${window.location.origin}/admin/products/filter/${active}/search=${query}/sort=${sortValue}`)
            } else { 
                if(query=="allProducts") {
                    window.location.replace(`${window.location.origin}/admin/products`)

            } else {
                window.location.replace(`${window.location.origin}/admin/products/filter/${active}/search=${query}`)
            }
            }
        } else {
            window.location.replace(`${window.location.origin}/admin/products/filter/active/search=${this.state.query}`)
        }
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
            window.location.replace(`${baseURL}/admin/products/search/${this.props.match.params.query}/page/${page}`)
        } else {
        window.location.replace(`${baseURL}/admin/products/page/${page}`)
        }        
    }    

    renderCategories = () => {
        return this.state.categories.map(category => {
            if(this.props.match.params.categoryId===category._id) {
                return (
                    <option value={category._id} selected>{category.name}</option>
                )
            } else {
            return (
                <option value={category._id}>{category.name}</option>
            )
            }
        })

    }

    handleFilter = async e => {
        e.preventDefault();
        const { query, active, sortValue} = this.props.match.params;
        let priceA = this.state.priceA;
        let priceB = this.state.priceB;
        let categoryId = this.state.categoryFilter;
        if(categoryId=="") {
            categoryId="all"
        }
        if(priceA==='') {
            priceA=0
        }
        if(priceB==='') {
            priceB=0
        }
        
        if(active) {
            if(sortValue && query) {
                window.location.replace(`${window.location.origin}/admin/products/filter/${active}/search=${query}/category=${categoryId}/pricefrom=${priceA}/priceto=${priceB}/sort=${sortValue}`)
            } else if(sortValue) {
                window.location.replace(`${window.location.origin}/admin/products/filter/${active}/category=${categoryId}/pricefrom=${priceA}/priceto=${priceB}/sort=${sortValue}`)
            } else if (query) {
                window.location.replace(`${window.location.origin}/admin/products/filter/${active}/search=${query}/category=${categoryId}/pricefrom=${priceA}/priceto=${priceB}`)
            }
        } else {
            window.location.replace(`${window.location.origin}/admin/products/filter/active/category=${categoryId}/pricefrom=${priceA}/priceto=${priceB}`)
        }
    }

    handleSort = async e => {
        e.preventDefault();
        const {active, query, priceA, priceB, categoryId } = this.props.match.params;
        if(active) {
            if(categoryId && query) {
                window.location.replace(`${window.location.origin}/admin/products/filter/${active}/search=${query}/category=${categoryId}/pricefrom=${priceA}/priceto=${priceB}/sort=${this.state.sortFilter}`)
            } else if (categoryId) {
                window.location.replace(`${window.location.origin}/admin/products/filter/${active}/category=${categoryId}/pricefrom=${priceA}/priceto=${priceB}/sort=${this.state.sortFilter}`)
            } else if(query) {
                window.location.replace(`${window.location.origin}/admin/products/filter/${active}/search=${query}/sort=${this.state.sortFilter}`)
            }
        } else {
            window.location.replace(`${window.location.origin}/admin/products/filter/active/sort=${this.state.sortFilter}`)
        }
        
    }

    handleManyActions = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt");
        switch(this.state.actionChoosen) {
            case 'delete':
                this.state.checked.map(async element => {
                    await this.props.deleteProduct(element, jwt)
                })
            break;
            case 'change-price':
                if(this.state.valueToChange==='' || isNaN(this.state.valueToChange)) {
                    return this.setState({actionError: "Musisz podać liczbę"})
                } else if(this.state.valueToChange <= 0) {
                    return this.setState({actionError: "Cena musi być większa od 0"})
                } else {
                    this.state.checked.map(async element => {
                    try {await this.props.updatePrice(element, this.state.valueToChange, jwt)
                    this.setState({message:this.props.product.message})}
                    
                    catch(err) {
                        await this.setState({message: "Coś poszło nie tak"})
                    }
                    let root = document.getElementById("root");
                    let statusChanged = document.createElement("div")
                    statusChanged.setAttribute("class", "status-changed");
                    statusChanged.innerText=`${this.state.message}`;
                    root.after(statusChanged);
                    setTimeout(function() {
                        statusChanged.remove()}, 2000)
                    });
                }
            break;
            case 'change-stock':
                if(this.state.valueToChange==='' || isNaN(this.state.valueToChange)) {
                    return this.setState({actionError: "Musisz podać liczbę"})
                } else if(this.state.valueToChange < 0) {
                    return this.setState({actionError: "Stan magazynowy nie może być ujemny"})
                }
                this.state.checked.map(async element => {
                    try {
                        await this.props.updateStock(element, this.state.valueToChange, jwt)
                        this.setState({message:this.props.product.message})
                    } catch(err) {
                        await this.setState({message: "Coś poszło nie tak"})
                    }
                    let root = document.getElementById("root");
                    let statusChanged = document.createElement("div")
                    statusChanged.setAttribute("class", "status-changed");
                    statusChanged.innerText=`${this.state.message}`;
                    root.after(statusChanged);
                    setTimeout(function() {
                        statusChanged.remove()}, 2000)
                    });
            break;
            default:
            this.setState({actionError: "Musisz wybrać akcję"})
        }
        
        // window.location.reload();
    }

    renderSortFilters = () => {
        
            let array = [
                {value:"-dateAdded", text: "Domyślnie - od najnowszych"},
                {value:"price", text: "Cena - od najtańszych"},
                {value:"-price",  text: "Cena - od najdroższych"},
                {value:"name", text: "Nazwa A-Z"},
                {value:"-name", text: "Nazwa Z-A"},
                {value:"numberInStock", text: "Stan magazynowy rosnąco"},
                {value:"-numberInStock", text: "Stan magazynowy malejąco"}
            ]
            return array.map(element => {
                if(this.props.match.params.sortValue == element.value) {
                    return <option value={element.value} selected>{element.text}</option>
                } else {
                    return <option value={element.value}>{element.text}</option>
                }
            })
    }
    
    render() {

        const renderInput = (
            <input
            type="text"
            name="value-to-change"
            placeholder="Podaj wartość..."
            onChange={this.handleChange}
            />
        )
        
        const manyActions = (
            <div className="many-actions">
                <select name="choose-action" onChange={this.handleChange}>
                    <option value="">Wybierz akcję</option>
                    <option value="delete">Usuń</option>
                    <option value="change-price">Zmień cenę</option>
                    <option value="change-stock">Zmień stan magazynowy</option>
                </select>
                {this.state.actionChoosen==="change-price" || this.state.actionChoosen==="change-stock" ? renderInput : null}
                <button className="panel-button" onClick={this.handleManyActions}>Wykonaj</button>
                {this.state.actionError}
            </div>
        )
        const renderProducts = (
            <><div className="products-navigation-header">
                <a href={"/admin/products/add"}><button className="panel-button">+ dodaj produkt</button></a>
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
                <div className="filter-bar">
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
                </div>
                <div className="sort-bar">
                    <select
                    name="sort-filter"
                    onChange={this.handleChange}
                    >
                        {this.renderSortFilters()}
                    </select>
                    <button onClick={this.handleSort} className="panel-button">Sortuj</button>
                </div>
                {this.state.checked.length>0 ? manyActions : null}
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr>
            <th></th>
            <th>Produkt</th>
            <th>Magazyn</th>
            <th>Kod produktu</th>
            <th>Cena</th>
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
    return { products: state.products, product: state.product, categories: state.categories };
};
export default connect(
    mapStateToProps,
    { getProducts, deleteProduct, getProduct, getProductsByQuery, sortProducts, getProductsByFilters, updatePrice, updateStock, getCategories }
)(Products);