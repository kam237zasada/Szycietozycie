import { combineReducers } from 'redux';
import adminReducer from './adminReducer';
import fetchProducts from './fetchProducts';
import productReducer from './productReducer';
import fetchCategories from './fetchCategories';
import categoryReducer from './categoryReducer';

export default combineReducers({
    admin: adminReducer,
    products: fetchProducts,
    product: productReducer,
    categories: fetchCategories,
    category: categoryReducer
});

