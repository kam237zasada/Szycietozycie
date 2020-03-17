import apis from '../api/index';

export const adminLogin = (email, password) => async dispatch => {
    let response = await apis.post('admin/login', {email, password});
    alert(response.data.message);
    localStorage.setItem('id', response.data._id);
    dispatch({type: 'LOGIN', payload: response.data });
};

export const checkId = (id) => async dispatch => {
    let response = await apis.post('admin/auth', {id});
    dispatch({type: 'CHECK_ID', payload: response.data });
}

export const getAdmin = id => async dispatch => {
    let response = await apis.get(`admin/${id}`);
    dispatch({type: 'GET_ADMIN', payload: response.data});
}

export const getProducts = () => async dispatch => {
    let response = await apis.get('product');
    dispatch({type: 'GET_PRODUCTS', payload: response.data});
}

export const getProduct = id => async dispatch => {
    let response = await apis.get(`product/${id}`);
    dispatch({type: 'GET_PRODUCT', payload: response.data});
}

export const addProduct = (name, categoryId, color, description, productCode, numberInStock, price) => async dispatch => {
    let response = await apis.post('product/add', {name,categoryId, color, description, productCode, numberInStock, price});
    alert(response.data.message);
    dispatch({type: 'ADD_PRODUCT', payload: response.data});
}
export const updateProduct = (id, name, categoryId, color, description, productCode, numberInStock, price) => async dispatch => {
    let response = await apis.put(`product/${id}`, {name, categoryId, color, description, productCode, numberInStock, price});
    dispatch({type: 'UPDATE_PRODUCT', payload: response.data});
}

export const deleteProduct = id => async dispatch => {
    let response = await apis.delete(`product/${id}`);
    dispatch({type: 'DELETE_PRODUCT', payload: response.data});
}

export const getCategories = () => async dispatch => {
    let response = await apis.get('category');
    dispatch({type: 'GET_CATEGORIES', payload: response.data});
}

export const getCategory = id => async dispatch => {
    let response = await apis.get(`category/${id}`);
    dispatch({type: 'GET_CATEGORY', payload: response.data});
}

export const addCategory = (name) => async dispatch => {
    let response = await apis.post('category/add', {name});
    alert(response.data.message);
    dispatch({type: 'ADD_CATEGORY', payload: response.data});
}

export const updateCategory = (id, name) => async dispatch => {
    let response = await apis.put(`category/${id}`, {name});
    dispatch({type: 'UPDATE_CATEGORY', payload: response.data});
}

export const deleteCategory = id => async dispatch => {
    let response = await apis.delete(`category/${id}`);
    dispatch({type: 'DELETE_CATEGORY', payload: response.data});
}