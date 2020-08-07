import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { getCookie, deleteCookie } from '../../js/index';
import { Redirect } from 'react-router-dom';
import {getAdmin, adminLogout} from '../../actions/index';
import { connect } from 'react-redux';
import Sales from './Sales';
import Admins from './Admins';
import Products from './Products';
import Settings from './Settings';
import Categories from './Categories';
import Shipments from './Shipments';
import Payments from './Payments';
import Statuses from './Statuses';
import Variants from './Variants';
import Colors from './Colors';
import Customers from './Customers';
import Discounts from './Discounts';
import Sites from './Sites'

import NewAdminForm from './NewAdminForm';
import NewProductForm from './NewProductForm';
import NewCategoryForm from './NewCategoryForm';
import NewShipmentForm from './NewShipmentForm';
import NewPaymentForm from './NewPaymentForm';
import NewStatusForm from './NewStatusForm';
import CustomerForm from './CustomerForm';
import DiscountForm from './DiscountForm';
import NewSiteForm from './NewSiteForm';


import UpdateProductForm from './UpdateProductForm';
import UpdateCategoryForm from './UpdateCategoryForm';
import UpdateAdminForm from './UpdateAdminForm';
import UpdateShipmentForm from './UpdateShipmentForm';
import UpdatePaymentForm from './UpdatePaymentForm';
import UpdateStatusForm from './UpdateStatusForm';

import OrderDetails from './OrderDetails';
import VariantForm from './VariantForm';
import ColorForm from './ColorForm';

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            logged: true
        }
    }

    componentDidMount = async () => {
        const id = getCookie('adminId');
        const jwt = getCookie('jwt');
        try {
            await this.props.getAdmin(id, jwt); 
            if(!this.props.admin.name) { 
        }       
        } catch (err) {
            await this.props.adminLogout();
            this.setState({logged: false})  
        }

    }
    render() {

        const renderSite = (
            <Router>
                <Switch>
                    <Route path="/admin/orders/:byStatus" exact component={Sales}/>
                    <Route path="/admin/orders/:byStatus/page/:pageNumber" exact component={Sales}/>
                    <Route path="/admin/orders/:byStatus/:query" exact component={Sales}/>
                    <Route path="/admin/orders/:byStatus/:query/page/:pageNumber" exact component={Sales}/>
                    <Route path="/admin/products" exact component={Products}/>
                    <Route path="/admin/products/page/:pageNumber" exact component={Products}/>

                    <Route path="/admin/products/filter/:active/sort=:sortValue" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/sort=:sortValue/page/:pageNumber" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/search=:query" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/search=:query/page/:pageNumber" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/category=:categoryId/pricefrom=:priceA/priceto=:priceB" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/category=:categoryId/pricefrom=:priceA/priceto=:priceB/page/:pageNumber" exact component={Products}/>

                    <Route path="/admin/products/filter/:active/search=:query/sort=:sortValue" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/search=:query/sort=:sortValue/page/:pageNumber" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/category=:categoryId/pricefrom=:priceA/priceto=:priceB/sort=:sortValue" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/category=:categoryId/pricefrom=:priceA/priceto=:priceB/sort=:sortValue/page/:pageNumber" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/search=:query/category=:categoryId/pricefrom=:priceA/priceto=:priceB" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/search=:query/category=:categoryId/pricefrom=:priceA/priceto=:priceB/page/:pageNumber" exact component={Products}/>
                   
                    <Route path="/admin/products/filter/:active/search=:query/category=:categoryId/pricefrom=:priceA/priceto=:priceB/sort=:sortValue" exact component={Products}/>
                    <Route path="/admin/products/filter/:active/search=:query/category=:categoryId/pricefrom=:priceA/priceto=:priceB/sort=:sortValue/page/:pageNumber" exact component={Products}/>
                    
                    <Route path="/admin/products/add" exact component={NewProductForm}/>
                    <Route path="/admin/products/edit/:id" exact component={NewProductForm}/>
                    <Route path="/admin/konfiguracja" exact component={Settings}/>
                    <Route path="/admin/kategorie" exact component={Categories}/>
                    <Route path="/admin/kategorie/dodaj" exact component={NewCategoryForm}/>
                    <Route path="/admin/kategorie/:id" exact component={UpdateCategoryForm}/>
                    <Route path="/admin/moje-konto" exact component={UpdateAdminForm}/>
                    <Route path="/admin/admins" exact component={Admins}/>
                    <Route path="/admin/admins/add" exact component={NewAdminForm}/>
                    <Route path="/admin/admins/:id" exact component={UpdateAdminForm}/>
                    <Route path="/admin/dostawy" exact component={Shipments}/>
                    <Route path="/admin/dostawy/dodaj" exact component={NewShipmentForm}/>
                    <Route path="/admin/dostawy/:id" exact component={NewShipmentForm}/>
                    <Route path="/admin/platnosci" exact component={Payments}/>
                    <Route path="/admin/platnosci/dodaj" exact component={NewPaymentForm}/>
                    <Route path="/admin/platnosci/:id" exact component={UpdatePaymentForm}/>
                    <Route path="/admin/statuses" exact component={Statuses}/>
                    <Route path="/admin/statuses/add" exact component={NewStatusForm}/>
                    <Route path="/admin/statuses/edit/:id" exact component={NewStatusForm}/>
                    <Route path="/admin/orders/show/details/:id" exact component={OrderDetails}/>
                    <Route path="/admin/variants" exact component={Variants}/>
                    <Route path="/admin/variants/add" exact component={VariantForm}/>
                    <Route path="/admin/variants/:id" exact component={VariantForm}/>
                    <Route path="/admin/colors" exact component={Colors}/>
                    <Route path="/admin/colors/add" exact component={ColorForm}/>
                    <Route path="/admin/colors/:id" exact component={ColorForm}/>
                    <Route path="/admin/customers" exact component={Customers}/>
                    <Route path="/admin/customers/page/:pageNumber" exact component={Customers}/>
                    <Route path="/admin/customers/search/:query" exact component={Customers}/>
                    <Route path="/admin/customers/search/:query/page/:pageNumber" exact component={Customers}/>
                    <Route path="/admin/customers/edit/:id" exact component={CustomerForm}/>
                    <Route path="/admin/discounts" exact component={Discounts}/>
                    <Route path="/admin/discounts/edit/:id" exact component={DiscountForm}/>
                    <Route path="/admin/discounts/add" exact component={DiscountForm}/>
                    <Route path="/admin/sites" exact component={Sites}/>
                    <Route path="/admin/sites/edit/:id" exact component={NewSiteForm}/>
                    <Route path="/admin/sites/add" exact component={NewSiteForm}/>

                </Switch>
            </Router>
        )
        return(
        <div className="content-container">{this.state.logged ? renderSite : <Redirect push to="/admin"/>}</div>
            
        )
    }
}

const mapStateToProps = state => {
    return { admin: state.admin };
};
export default connect(
    mapStateToProps,
    { getAdmin, adminLogout }
)(Content);