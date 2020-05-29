import apis from '../api/index';
import {setCookie, deleteCookie, getCookie } from '../js/index';

export const checkId = (id) => async dispatch => {
    let response = await apis.post('admin/auth', {id});
    dispatch({type: 'CHECK_ID', payload: response.data });
}

export const getAdmin = id => async dispatch => {
    let response = await apis.get(`admin/${id}`);
    dispatch({type: 'GET_ADMIN', payload: response.data});
}

export const getAdmins = () => async dispatch => {
    let response = await apis.get('admin');
    dispatch({type: 'GET_ADMINS', payload: response.data});
}

export const addAdmin = (email, name, password, confirmPassword) => async dispatch => {
    let response = await apis.post('admin/register', {email, name, password, confirmPassword});
    dispatch({type: 'ADD_ADMIN', payload: response.data})
}

export const adminLogin = (email, password) => async dispatch => {
    let response = await apis.post('admin/login', {email, password});
    alert(response.data.message);
    localStorage.setItem('id', response.data._id);
    dispatch({type: 'ADMIN_LOGIN', payload: response.data });
}

export const adminLogout = () => async dispatch => {
    localStorage.removeItem('id');
    dispatch({type: 'ADMIN_LOGOUT'});
}

export const updateAdmin = (id, email, name) => async dispatch => {
    let response = await apis.put(`admin/${id}`, {email, name});
    const xhr = new XMLHttpRequest();
    console.log(xhr);
    dispatch({type: 'UPDATE_ADMIN', payload: response.data});
    console.log(response);
}

export const updateAdminPassword = (id, currentPassword, password, confirmPassword) => async dispatch => {
    let response = await apis.put(`admin/${id}/password`, {currentPassword, password, confirmPassword});
    dispatch({type: 'UPDATE_ADMIN_PASSWORD', payload: response.data});
}

export const deleteAdmin = id => async dispatch => {
    let response = await apis.delete(`admin/${id}`);
    dispatch({type: 'DELETE_ADMIN', payload: response.data});
}

export const getCustomer = id => async dispatch => {
    let response = await apis.get(`customer/${id}`);
    dispatch({type: 'GET_CUSTOMER', payload: response.data});
}

export const getCustomers = () => async dispatch => {
    let response = await apis.get('customer');
    dispatch({type: 'GET_CUSTOMERS', payload: response.data});
}

export const addCustomer = (login, email, password, confirmPassword) => async dispatch => {
    let response = await apis.post('customer/register', {login, email, password, confirmPassword});
    dispatch({type: 'ADD_CUSTOMER', payload: response.data})
}

export const customerLogin = (login, password) => async dispatch => {
    let response = await apis.post('customer/login', {login, password});
    alert(response.data.message);
    localStorage.setItem('customerid', response.data._id);
    dispatch({type: 'CUSTOMER_LOGIN', payload: response.data });
}

export const customerLogout = () => async dispatch => {
    localStorage.removeItem('customerid');
    dispatch({type: 'CUSTOMER_LOGOUT'});
}

export const addData = (id, name, secondName, address, postalCode, city, telephone) => async dispatch => {
    let response = await apis.put(`customer/${id}/data`, {name, secondName, address, postalCode, city, telephone});
    dispatch({type: 'ADD_DATA', payload: response.data});
}

export const updateCustomer = (id, login, email, name, secondName, address, postalCode, city, telephone) => async dispatch => {
    let response = await apis.put(`customer/${id}`, {login, email, name, secondName, address, postalCode, city, telephone});
    dispatch({type: 'UPDATE_CUSTOMER', payload: response.data});
    console.log(response);
}

export const updateCustomerPassword = (id, currentPassword, password, confirmPassword) => async dispatch => {
    let response = await apis.put(`customer/${id}/password`, {currentPassword, password, confirmPassword});
    dispatch({type: 'UPDATE_CUSTOMER_PASSWORD', payload: response.data});
}

export const deleteCustomer = id => async dispatch => {
    let response = await apis.delete(`customer/${id}`);
    dispatch({type: 'CUSTOMER', payload: response.data});
}

export const getProducts = () => async dispatch => {
    let response = await apis.get('product');
    dispatch({type: 'GET_PRODUCTS', payload: response.data});
}

export const getProduct = id => async dispatch => {
    let response = await apis.get(`product/${id}`);
    dispatch({type: 'GET_PRODUCT', payload: response.data});
}

export const getProductsByCategory = id => async dispatch => {
    let response = await apis.get(`product/category/${id}`);
    dispatch({type: 'GET_PRODUCTS_BY_CATEGORY', payload: response.data});
}

export const getProductsByQuery = query => async dispatch => {
    let response = await apis.get(`product/query/${query}`);
    dispatch({type: 'GET_PRODUCTS_BY_QUERY', payload: response.data});
}
// const config = {
//     headers: {
//         'content-type': 'multipart/form-data'
//     }
// };
export const addProduct = (name, categoryId, color, description, productCode, numberInStock, price, productImage) => async dispatch => {
    console.log({productImage: productImage, name: name})
    let response = await apis.post('product/add', {name,categoryId, color, description, productCode, numberInStock, price, productImage});
    alert(response.data.message);
    dispatch({type: 'ADD_PRODUCT', payload: response.data});
}

export const getNewCode = () => async dispatch => {
    let response = await apis.get('product');
    let number, string;
    if(!response) { number = 1}
    else {
    let lastIndexNumber = response.data.length -1;
    let currentNumber = response.data[lastIndexNumber].ID +1;
    string = currentNumber.toString(); 
    }
    dispatch({type: 'GET_NEW_CODE', payload: string})
}
export const updateProduct = (id, name, categoryId, color, description, productCode, numberInStock, price, productImage) => async dispatch => {
    let response = await apis.put(`product/${id}`, {name, categoryId, color, description, productCode, numberInStock, price, productImage});
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

export const getBaskets = () => async dispatch => {
    let response = await apis.get('basket');
    dispatch({type: 'GET_BASKETS', payload: response.data});
}

export const getBasket = id => async dispatch => {
    let response = await apis.get(`basket/${id}`);
    dispatch({type: 'GET_BASKET', payload: response.data})
}

export const addBasket = (_id, amount) => async dispatch => {
    let response = await apis.post('basket/add', {_id, amount});
    // localStorage.setItem('basketId', response.data._id);
    setCookie("basketId", response.data._id, 72);
    alert("Produkt dodany do koszyka")
    dispatch({type: 'ADD_BASKET', payload: response.data});

}

export const updateBasket = (id, _id, amount, operation) => async dispatch => {
    let response = await apis.put(`basket/${id}`, {_id, amount, operation});
    // setCookie("basketId", id, 72);
    // alert("Produkt dodany do koszyka")
    dispatch({type: 'UPDATE_BASKET', payload: response.data});
}

export const deleteBasket = id => async dispatch => {
    let response = await apis.delete(`basket/${id}`);
    deleteCookie("basketId")
    dispatch({type: 'DELETE_BASKET', payload: response.data});
}

export const getShipments = () => async dispatch => {
    let response = await apis.get('shipment');
    dispatch({type: 'GET_SHIPMENTS', payload: response.data});
}

export const getShipment = id => async dispatch => {
    let response = await apis.get(`shipment/${id}`);
    dispatch({type: 'GET_SHIPMENT', payload: response.data});
}

export const addShipment = (name, price) => async dispatch => {
    let response = await apis.post('shipment/add', {name, price});
    dispatch({type: 'ADD_SHIPMENT', payload: response.data});
}

export const updateShipment = (id, name, price) => async dispatch => {
    let response = await apis.put(`shipment/${id}`, {name, price});
    dispatch({type: 'UPDATE_SHIPMENT', payload: response.data});
}

export const deleteShipment = id => async dispatch => {
    let response = await apis.delete(`shipment/${id}`);
    dispatch({type: 'DELETE_SHIPMENT', payload: response.data});
}

export const getPayments = () => async dispatch => {
    let response = await apis.get('payment');
    dispatch({type: 'GET_PAYMENTS', payload: response.data});
}

export const getPayment = id => async dispatch => {
    let response = await apis.get(`payment/${id}`);
    dispatch({type: 'GET_PAYMENT', payload: response.data});
}

export const addPayment = (name) => async dispatch => {
    let response = await apis.post('payment/add', {name});
    dispatch({type: 'ADD_PAYMENT', payload: response.data});
}

export const updatePayment = (id, name) => async dispatch => {
    let response = await apis.put(`payment/${id}`, {name});
    dispatch({type: 'UPDATE_PAYMENT', payload: response.data});
}

export const deletePayment = id => async dispatch => {
    let response = await apis.delete(`payment/${id}`);
    dispatch({type: 'DELETE_PAYMENT', payload: response.data});
}

export const getOrder = id => async dispatch => {
    let response = await apis.get(`order/${id}`);
    dispatch({type: 'GET_ORDER', payload: response.data});
}

export const getOrders = () => async dispatch => {
    let response = await apis.get('order');
    dispatch({type: 'GET_ORDERS', payload: response.data});
}

export const addOrder = (customerIdentities, shipmentIdentities, invoiceIdentities, customer, products, shipmentId, paymentId, value, statusID) => async dispatch => {
    let basketId= getCookie("basketId");
    let response = await apis.post('order/add', {customerIdentities, shipmentIdentities, invoiceIdentities, customer, products, shipmentId, paymentId, value, statusID, basketId});
    deleteCookie("basketId")
    alert("Zamówienie złożone");
    dispatch({type: 'ADD_ORDER', payload: response.data});
}
export const updateOrderStatus = (_id, statusID) => async dispatch => {
    let response = await apis.put(`order/${_id}/status`, {statusID});
    dispatch({type: 'UPDATE_ORDER_STATUS', payload: response.data.message});
}

export const getStatuses = () => async dispatch => {
    let response = await apis.get('status');
    dispatch({type: 'GET_STATUSES', payload: response.data});
}

export const getStatus = id => async dispatch => {
    let response = await apis.get(`status/${id}`);
    dispatch({type: 'GET_STATUS', payload: response.data});
}

export const addStatus = (name) => async dispatch => {
    let response = await apis.post('status/add', {name});
    dispatch({type: 'ADD_STATUS', payload: response.data});
}

export const updateStatus = (id, name) => async dispatch => {
    let response = await apis.put(`status/${id}`, {name});
    dispatch({type: 'UPDATE_STATUS', payload: response.data});
}

export const deleteStatus = id => async dispatch => {
    let response = await apis.delete(`status/${id}`);
    dispatch({type: 'DELETE_STATUS', payload: response.data});
}