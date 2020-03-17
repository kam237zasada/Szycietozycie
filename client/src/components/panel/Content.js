import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sales from './Sales';
import Products from './Products';
import Settings from './Settings';
import NewProductForm from './NewProductForm';
import UpdateProductForm from './UpdateProductForm';
import Categories from './Categories';
import NewCategoryForm from './NewCategoryForm';
import UpdateCategoryForm from './UpdateCategoryForm';

class Content extends React.Component {

    render() {
        return(
            <Router>
                <Switch>
                    <Route path="/admin/sprzedaz" exact component={Sales}/>
                    <Route path="/admin/produkty" exact component={Products}/>
                    <Route path="/admin/produkty/dodaj" exact component={NewProductForm}/>
                    <Route path="/admin/produkty/:id" exact component={UpdateProductForm}/>
                    <Route path="/admin/ustawienia" exact component={Settings}/>
                    <Route path="/admin/kategorie" exact component={Categories}/>
                    <Route path="/admin/kategorie/dodaj" exact component={NewCategoryForm}/>
                    <Route path="/admin/kategorie/:id" exact component={UpdateCategoryForm}/>
                </Switch>
            </Router>
        )
    }
}

export default Content