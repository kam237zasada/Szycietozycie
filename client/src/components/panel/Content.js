import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sales from './Sales';
import Admins from './Admins';
import Products from './Products';
import Settings from './Settings';
import Categories from './Categories';
import Shipments from './Shipments';
import Payments from './Payments';
import Statuses from './Statuses';

import NewAdminForm from './NewAdminForm';
import NewProductForm from './NewProductForm';
import NewCategoryForm from './NewCategoryForm';
import NewShipmentForm from './NewShipmentForm';
import NewPaymentForm from './NewPaymentForm';
import NewStatusForm from './NewStatusForm';

import UpdateProductForm from './UpdateProductForm';
import UpdateCategoryForm from './UpdateCategoryForm';
import UpdateAdminForm from './UpdateAdminForm';
import UpdateShipmentForm from './UpdateShipmentForm';
import UpdatePaymentForm from './UpdatePaymentForm';
import UpdateStatusForm from './UpdateStatusForm';

class Content extends React.Component {

    render() {
        return(
            <Router>
                <Switch>
                    <Route path="/admin/orders/all" exact component={Sales}/>
                    <Route path="/admin/produkty" exact component={Products}/>
                    <Route path="/admin/produkty/dodaj" exact component={NewProductForm}/>
                    <Route path="/admin/produkty/:id" exact component={UpdateProductForm}/>
                    <Route path="/admin/konfiguracja" exact component={Settings}/>
                    <Route path="/admin/kategorie" exact component={Categories}/>
                    <Route path="/admin/kategorie/dodaj" exact component={NewCategoryForm}/>
                    <Route path="/admin/kategorie/:id" exact component={UpdateCategoryForm}/>
                    <Route path="/admin/moje-konto" exact component={UpdateAdminForm}/>
                    <Route path="/admin/administratorzy" exact component={Admins}/>
                    <Route path="/admin/administratorzy/dodaj" exact component={NewAdminForm}/>
                    <Route path="/admin/dostawy" exact component={Shipments}/>
                    <Route path="/admin/dostawy/dodaj" exact component={NewShipmentForm}/>
                    <Route path="/admin/dostawy/:id" exact component={UpdateShipmentForm}/>
                    <Route path="/admin/platnosci" exact component={Payments}/>
                    <Route path="/admin/platnosci/dodaj" exact component={NewPaymentForm}/>
                    <Route path="/admin/platnosci/:id" exact component={UpdatePaymentForm}/>
                    <Route path="/admin/statusy" exact component={Statuses}/>
                    <Route path="/admin/statusy/dodaj" exact component={NewStatusForm}/>
                    <Route path="/admin/statusy/:id" exact component={UpdateStatusForm}/>

                </Switch>
            </Router>
        )
    }
}

export default Content