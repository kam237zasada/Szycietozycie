import apis from '../api/index';
import {setCookie, deleteCookie, getCookie } from '../js/index';
import { baseURL } from '../api/index';
const axios=require('axios');

export const checkId = (id) => async dispatch => {
    let response = await apis.post('admin/auth', {id});
    dispatch({type: 'CHECK_ID', payload: response.data });
}

export const getAdmin = (id, jwt) => async dispatch => {
        let response = await apis.get(`admin/${id}`, {headers: {
        token: jwt
    }});
    dispatch({type: 'GET_ADMIN', payload: response.data});

}

export const getAdmins = (jwt) => async dispatch => {
    let response = await apis.get('admin', { headers: {token: jwt}});
    dispatch({type: 'GET_ADMINS', payload: response.data});
}

export const addAdmin = (email, name, password, confirmPassword, adminPassword, jwt) => async dispatch => {
    let response = await apis.post('admin/register', {email, name, password, confirmPassword, adminPassword}, {headers: {token: jwt}});
    dispatch({type: 'ADD_ADMIN', payload: response.data})}


export const adminLogin = (email, password) => async dispatch => {
    let response = await apis.post('admin/login', {email, password});
    setCookie("jwt", response.data.accessToken, 1);
    setCookie("adminId", response.data._id, 1);
    dispatch({type: 'ADMIN_LOGIN', payload: response.data });
}

export const adminLogout = () => async dispatch => {
    setCookie("adminId", '', 0.000001);
    setCookie("jwt", "", 0.0000001);
    window.location.replace(`${baseURL}/admin`);
    dispatch({type: 'ADMIN_LOGOUT'});
}

export const updateAdmin = (id, email, name, adminPassword, jwt) => async dispatch => {
    let response = await apis.put(`admin/${id}`, {email, name, adminPassword},{headers: {token: jwt}});
    dispatch({type: 'UPDATE_ADMIN', payload: response.data});
}

export const updateAdminPassword = (id, adminPassword, password, confirmPassword, jwt) => async dispatch => {
    let response = await apis.put(`admin/${id}/password`, {adminPassword, password, confirmPassword}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_ADMIN_PASSWORD', payload: response.data});
}

export const deleteAdmin = (id, password, jwt) => async dispatch => {
    console.log("jwt " + jwt)
    let response = await apis.delete(`admin/${id}`, {headers: {token: jwt, password: password}});
    dispatch({type: 'DELETE_ADMIN', payload: response.data});
}

export const getCustomer = (id, jwt) => async dispatch => {
    let response = await apis.get(`customer/edit/${id}`, {headers: {token: jwt}});
    dispatch({type: 'GET_CUSTOMER', payload: response.data});
}

export const getCustomers = (page, jwt) => async dispatch => {
    let response = await apis.get(`customer/page/${page}`, {headers: {token: jwt}});
    dispatch({type: 'GET_CUSTOMERS', payload: response.data});
}

export const getCustomersByQuery = (query, page, jwt) => async dispatch => {
    let response = await apis.get(`customer/query/${query}/page/${page}`, {headers: {token: jwt}});
    dispatch({type: 'GET_CUSTOMERS', payload: response.data});
}

export const addCustomer = (login, email, password, confirmPassword) => async dispatch => {
    let response = await apis.post('customer/register', {login, email, password, confirmPassword});
    dispatch({type: 'ADD_CUSTOMER', payload: response.data})
}

export const customerLogin = (login, password) => async dispatch => {
    let response = await apis.post('customer/login', {login, password});
    setCookie('customerId', response.data._id, 1);
    setCookie("jwt", response.data.accessToken, 1);
    dispatch({type: 'CUSTOMER_LOGIN', payload: response.data });
}

export const customerLogout = () => async dispatch => {
    setCookie("jwt", "", 0.000001)
    setCookie("customerId", "", 0.000001)
    dispatch({type: 'CUSTOMER_LOGOUT'});
}

export const passwordReminder = email => async dispatch => {
    let response = await apis.post(`customer/password/reminder`, {email});
    dispatch({type: `PASSWORD_REMINDER`, payload: response.data})
}

export const newPassword = (_id, password, token) => async dispatch => {
    let response = await apis.put(`customer/edit/password/${_id}`, {password}, {headers: {token: token}});
    dispatch({type: `NEW_PASSWORD`, payload: response.data})
}

export const updateData = (id, name, telephone, street, zipCode, city, jwt) => async dispatch => {
    let response = await apis.put(`customer/${id}/data`, {name, telephone, street, zipCode, city}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_DATA', payload: response.data});
}

export const updateInvoice = (id, companyName, companyStreet, companyZipCode, companyCity, companyNIP, jwt) => async dispatch => {
    let response = await apis.put(`customer/${id}/invoice`, {companyName, companyStreet, companyZipCode, companyCity, companyNIP},{headers: {token: jwt}});
    dispatch({type: 'UPDATE_INVOICE', payload: response.data});
}

export const updateCustomer = (id, login, email, jwt) => async dispatch => {
    let response = await apis.put(`customer/${id}`, {login, email}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_CUSTOMER', payload: response.data});
}

export const updateCustomerPassword = (id, currentPassword, password, confirmPassword, jwt) => async dispatch => {
    let response = await apis.put(`customer/${id}/password`, {currentPassword, password, confirmPassword},{headers: {token: jwt}});
    dispatch({type: 'UPDATE_CUSTOMER_PASSWORD', payload: response.data});
}

export const deleteCustomer = (id, jwt) => async dispatch => {
    let response = await apis.delete(`customer/${id}`, {headers: {token: jwt}});
    dispatch({type: 'CUSTOMER', payload: response.data});
}

export const getProducts = (priceA, priceB, sort, page) => async dispatch => {
    let response = await apis.get(`product/pricefrom=${priceA}/priceto=${priceB}/sortBy=${sort}/page/${page}`);
    dispatch({type: 'GET_PRODUCTS', payload: response.data});
}

export const getProduct = id => async dispatch => {
    let response = await apis.get(`product/${id}`);
    dispatch({type: 'GET_PRODUCT', payload: response.data});
}

export const addView = id => async dispatch => {
    let response = await apis.put(`product/v/views/${id}`);
    dispatch({type: 'UPDATE_PRODUCT', payload: response.data})
}

export const getProductsByCategory = (categoryId, priceA, priceB, sort, page) => async dispatch => {
    let response = await apis.get(`product/category/${categoryId}/pricefrom=${priceA}/priceto=${priceB}/sortBy=${sort}/page/${page}`);
    dispatch({type: 'GET_PRODUCTS_BY_CATEGORY', payload: response.data});
}

export const getProductsByQuery = (query, priceA, priceB, sort, page) => async dispatch => {
    let response = await apis.get(`product/query/${query}/pricefrom=${priceA}/priceto=${priceB}/sortBy=${sort}/page/${page}`);
    dispatch({type: 'GET_PRODUCTS_BY_QUERY', payload: response.data});
}

export const getProductsByFilters = (query, categoryId, priceA, priceB, sort, page) => async dispatch => {
    let response = await apis.get(`product/filter/query=${query}/category=${categoryId}/pricefrom=${priceA}/priceto=${priceB}/sortBy=${sort}/page/${page}`);
    dispatch({type: 'GET_PRODUCTS', payload: response.data});
}

export const sortProducts = (sortValue, page) => async dispatch => {
    let response = await apis.get(`product/sort/${sortValue}/page/${page}`);
    dispatch({type: 'GET_PRODUCTS', payload: response.data});
}

export const addProduct = (name, categoryId, color, shortDescription, description, productCode, numberInStock, price, shipmentTime, productImage, variantId, tags, alternatives, jwt) => async dispatch => {
    let response = await apis.post('product/add', {name,categoryId, color, shortDescription, description, productCode, numberInStock, price, shipmentTime, productImage, variantId, tags, alternatives}, {headers: {token: jwt}});
    dispatch({type: 'ADD_PRODUCT', payload: response.data});
}

export const getNewCode = () => async dispatch => {
    let response = await apis.get('product');
    let number, string;
    if(response.data.length===0) {
        number = 1
    } else {
    let lastIndexNumber = response.data.length -1;
    number = response.data[lastIndexNumber].ID +1;
    }
    string = number.toString(); 

    dispatch({type: 'GET_NEW_CODE', payload: string})
}
export const updateProduct = (id, name, categoryId, color, shortDescription, description, productCode, numberInStock, price, shipmentTime, productImage, variantId, tags, alternatives, jwt) => async dispatch => {
    let response = await apis.put(`product/${id}`, {name, categoryId, color, shortDescription, description, productCode, numberInStock, price, shipmentTime, productImage, variantId, tags, alternatives}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_PRODUCT', payload: response.data});
}

export const updatePrice = (id, price, jwt) => async dispatch => {
    let response = await apis.put(`product/price/${id}`, {price}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_PRODUCT', payload: response.data});
}

export const updateStock = (id, stock, jwt) => async dispatch => {
    let response = await apis.put(`product/stock/${id}`, {stock}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_PRODUCT', payload: response.data});
}

export const deleteProduct = (id, jwt) => async dispatch => {
    let response = await apis.delete(`product/${id}`, {headers: {token: jwt}});
    dispatch({type: 'DELETE_PRODUCT', payload: response.data});
}

export const getPopularProducts = () => async dispatch => {
    let response = await apis.get(`product/show/popular`);
    dispatch({type: 'GET_PRODUCTS', payload: response.data});
}

export const getCategories = () => async dispatch => {
    let response = await apis.get('category');
    dispatch({type: 'GET_CATEGORIES', payload: response.data});
}

export const getCategory = id => async dispatch => {
    let response = await apis.get(`category/${id}`);
    dispatch({type: 'GET_CATEGORY', payload: response.data});
}

export const addCategory = (name, jwt) => async dispatch => {
    let response = await apis.post('category/add', {name}, {headers: {token: jwt}});
    alert(response.data.message);
    dispatch({type: 'ADD_CATEGORY', payload: response.data});
}

export const updateCategory = (id, name, jwt) => async dispatch => {
    let response = await apis.put(`category/${id}`, {name}, {headers: {token:jwt}});
    dispatch({type: 'UPDATE_CATEGORY', payload: response.data});
}

export const deleteCategory = (id, jwt) => async dispatch => {
    let response = await apis.delete(`category/${id}`, {headers: {token: jwt}});
    dispatch({type: 'DELETE_CATEGORY', payload: response.data});
}

export const getBaskets = (jwt) => async dispatch => {
    let response = await apis.get('basket', {headers: {token: jwt}});
    dispatch({type: 'GET_BASKETS', payload: response.data});
}

export const getBasket = id => async dispatch => {
    let response = await apis.get(`basket/${id}`);
    dispatch({type: 'GET_BASKET', payload: response.data})
}

export const addBasket = (_id, variantName, variantValue, color, amount) => async dispatch => {
    let response = await apis.post('basket/add', {_id, variantName, variantValue, color, amount});
    setCookie("basketId", response.data._id, 72);
    dispatch({type: 'ADD_BASKET', payload: response.data});
}

export const updateBasket = (id, _id, amount, operation, color, variantName, variantValue) => async dispatch => {
    let response = await apis.put(`basket/${id}`, {_id, amount, operation, color, variantName, variantValue});
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

export const addShipment = (name, price, freeShipment, payments, jwt) => async dispatch => {
    let response = await apis.post('shipment/add', {name, price, freeShipment, payments}, {header: {token: jwt}});
    dispatch({type: 'ADD_SHIPMENT', payload: response.data});
}

export const updateShipment = (id, name, price, freeShipment, payments, jwt) => async dispatch => {
    let response = await apis.put(`shipment/${id}`, {name, price, freeShipment, payments}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_SHIPMENT', payload: response.data});
}

export const deleteShipment = (id, jwt) => async dispatch => {
    let response = await apis.delete(`shipment/${id}`, {headers: {token: jwt}});
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

export const addPayment = (name, jwt) => async dispatch => {
    let response = await apis.post('payment/add', {name}, {headers: {token: jwt}});
    dispatch({type: 'ADD_PAYMENT', payload: response.data});
}

export const updatePayment = (id, name, jwt) => async dispatch => {
    let response = await apis.put(`payment/${id}`, {name}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_PAYMENT', payload: response.data});
}

export const deletePayment = (id, jwt) => async dispatch => {
    let response = await apis.delete(`payment/${id}`);
    dispatch({type: 'DELETE_PAYMENT', payload: response.data}, {headers: {token: jwt}});
}

export const getOrder = (id, jwt) => async dispatch => {
    let response = await apis.get(`order/${id}`, {headers: {token: jwt}});
    dispatch({type: 'GET_ORDER', payload: response.data});
}

export const getSingleOrder = (accessToken) => async dispatch => {
    let response = await apis.get(`order/single-order/${accessToken}`);
    dispatch({type: 'GET_ORDER', payload: response.data});
}

export const getOrders = (page, jwt) => async dispatch => {
    let response = await apis.get(`order/page/${page}`, {headers: {token: jwt}});
    dispatch({type: 'GET_ORDERS', payload: response.data});
}

export const getNewOrders = (page, jwt) => async dispatch => {
    let response = await apis.get(`order/new/page/${page}`, {headers: {token: jwt}});
    dispatch({type: 'GET_ORDERS', payload: response.data});
}

export const getOpenOrders = (page, jwt) => async dispatch => {
    let response = await apis.get(`order/open/page/${page}`, {headers: {token: jwt}});
    dispatch({type: 'GET_ORDERS', payload: response.data});
}

export const getFinalizedOrders = (page, jwt) => async dispatch => {
    let response = await apis.get(`order/finalized/page/${page}`, {headers: {token: jwt}});
    dispatch({type: 'GET_ORDERS', payload: response.data});
}

export const getOrdersByClient = (id, jwt) => async dispatch => {
    let response = await apis.get(`order/customer/${id}`, {headers: {token: jwt}})
    dispatch({type: 'GET_ORDERS', payload: response.data});
}

export const getOrdersByQuery = (status, query, page, jwt) => async dispatch => {
    let response = await apis.get(`order/search/${status}/${query}/page/${page}`, {headers: {token: jwt}})
    dispatch({type: 'GET_ORDERS', payload: response.data});
}

export const addOrder = (customerIdentities, shipmentIdentities, invoiceIdentities, customer, products, shipmentId, shipmentCost, paymentId, cost, comment, discountActive, discountUsed) => async dispatch => {
    let basketId= getCookie("basketId");
    let response = await apis.post('order/add', {customerIdentities, shipmentIdentities, invoiceIdentities, customer, products, shipmentId, shipmentCost, paymentId, cost, comment, basketId, discountActive, discountUsed});
    deleteCookie("basketId")
    dispatch({type: 'ADD_ORDER', payload: response.data});
}
export const updateOrderStatus = (_id, statusID, jwt) => async dispatch => {
    let response = await apis.put(`order/${_id}/status`, {statusID}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_ORDER_STATUS', payload: response.data.message});
}

export const updatePrivateComment = (ID, privateComment, jwt) => async dispatch => {
    let response = await apis.put(`order/privcmnt/${ID}`, {privateComment}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_PRIVATE_COMMENT', payload: response.data});
}

export const updateMessages = (ID, comment, waybill, shipmentCompany, jwt) => async dispatch => {
    let response = await apis.put(`order/messages/${ID}`, {comment, waybill, shipmentCompany}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_MESSAGES', payload: response.data});
}

export const getStatuses = (jwt) => async dispatch => {
    let response = await apis.get('status', {headers: {token: jwt}});
    dispatch({type: 'GET_STATUSES', payload: response.data});
}

export const getStatus = (id, jwt) => async dispatch => {
    let response = await apis.get(`status/${id}`, {headers: {token: jwt}});
    dispatch({type: 'GET_STATUS', payload: response.data});
}

export const addStatus = (name, type, isDefault, jwt) => async dispatch => {
    let response = await apis.post('status/add', {name, type, isDefault}, {headers: {token: jwt}});
    dispatch({type: 'ADD_STATUS', payload: response.data});
}

export const updateStatus = (id, name, type, isDefault, jwt) => async dispatch => {
    let response = await apis.put(`status/${id}`, {name, type, isDefault}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_STATUS', payload: response.data});
}

export const deleteStatus = (id, jwt) => async dispatch => {
    let response = await apis.delete(`status/${id}`, {headers: {token: jwt}});
    dispatch({type: 'DELETE_STATUS', payload: response.data});
}

export const orderMessage = (email, data, jwt) => async dispatch => {
    let response = await apis.post('mail/order_message', {email, data}, {headers: {token: jwt}});
    dispatch({type: 'ORDER_MESSAGE', payload: response.data});
}
export const productQuestion = (email, data) => async dispatch => {
    let response = await apis.post('mail/product_question', {email, data});
    dispatch({type: 'PRODUCT_QUESTION', payload: response.data});
}

export const getColors = (jwt) => async dispatch => {
    let response = await apis.get('color', {headers: {token: jwt}});
    dispatch({type: 'GET_COLORS', payload: response.data});
}

export const getColor = (id, jwt) => async dispatch => {
    let response = await apis.get(`color/${id}`, {headers: {token: jwt}});
    dispatch({type: 'GET_COLOR', payload: response.data});
}

export const addColor = (name, jwt) => async dispatch => {
    let response = await apis.post('color/add', {name}, {headers: {token: jwt}});
    dispatch({type: 'ADD_COLOR', payload: response.data});
}

export const updateColor = (id, name, jwt) => async dispatch => {
    let response = await apis.put(`color/${id}`, {name}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_COLOR', payload: response.data});
}

export const deleteColor = (id, jwt) => async dispatch => {
    let response = await apis.delete(`color/${id}`, {headers: {token: jwt}});
    dispatch({type: 'DELETE_COLOR', payload: response.data});
}

export const getVariants = (jwt) => async dispatch => {
    let response = await apis.get('variant', {headers: {token: jwt}});
    dispatch({type: 'GET_VARIANTS', payload: response.data});
}

export const getVariant = (id, jwt) => async dispatch => {
    let response = await apis.get(`variant/${id}`, {headers: {token: jwt}});
    dispatch({type: 'GET_VARIANT', payload: response.data});
}

export const addVariant = (name, values, jwt) => async dispatch => {
    let response = await apis.post('variant/add', {name, values},{headers: {token: jwt}});
    dispatch({type: 'ADD_VARIANT', payload: response.data});
}

export const updateVariant = (id, name, values, jwt) => async dispatch => {
    let response = await apis.put(`variant/${id}`, {name, values}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_VARIANT', payload: response.data});
}

export const deleteVariant = (id, ID, jwt) => async dispatch => {
    let response = await apis.delete(`variant/${id}/${ID}`, {headers: {token: jwt}});
    dispatch({type: 'DELETE_VARIANT', payload: response.data});
}

export const fetchPaczkomatByPostCode = (postCode) => async dispatch => {
    let response = await axios.get(`https://api-shipx-pl.easypack24.net/v1/points?relative_post_code=${postCode}&type=parcel_locker&limit=5`);
    console.log(response.data)
    dispatch({type: 'GET_PACZKOMATY', payload: response.data.items});
}

export const fetchPaczkomatByCity = (city) => async dispatch => {
    let response = await axios.get(`https://api-shipx-pl.easypack24.net/v1/points?city=${city}&per_page=500&type=parcel_locker`);
    let array = response.data.items;
    if(response.data.count> 500) {
         for(let i=2; i<=response.data.total_pages; i++){
            let more = await axios.get(`https://api-shipx-pl.easypack24.net/v1/points?city=${city}&page=${i}&per_page=500&type=parcel_locker`)
            array = array.concat(more.data.items);
        } 
    }
    dispatch({type: 'GET_PACZKOMATY', payload: array});
}

export const getDiscounts = (jwt) => async dispatch => {
    let response = await apis.get('discount', {headers: {token: jwt}});
    dispatch({type: 'GET_DISCOUNTS', payload: response.data});
}

export const getDiscount = (id, jwt) => async dispatch => {
    let response = await apis.get(`discount/${id}`, {headers: {token: jwt}});
    dispatch({type: 'GET_DISCOUNT', payload: response.data});
}

export const checkDiscount = (code, customerId) => async dispatch => {
    console.log(customerId)
    let response = await apis.post(`discount/check/${code}`, {customerId});
    dispatch({type: 'GET_DISCOUNT', payload: response.data});
}

export const addDiscount = (name, code, type, value, isInfinite, active, isSingleUse, isSingleByUser, mustLogin, jwt) => async dispatch => {
    let response = await apis.post('discount/add', {name, code, type, value, isInfinite, active, isSingleUse, isSingleByUser, mustLogin}, {headers: {token: jwt}});
    dispatch({type: 'ADD_DISCOUNT', payload: response.data});
}

export const updateDiscount = (id, name, code, type, value, isInfinite, active, isSingleUse, isSingleByUser, mustLogin, jwt) => async dispatch => {
    let response = await apis.put(`discount/${id}`, {name, code, type, value, isInfinite, active, isSingleUse, isSingleByUser, mustLogin}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_DISCOUNT', payload: response.data});
}

export const deleteDiscount = (id, jwt) => async dispatch => {
    let response = await apis.delete(`discount/${id}`, {headers: {token: jwt}});
    dispatch({type: 'DELETE_DISCOUNT', payload: response.data});
}

export const getSites = () => async dispatch => {
    let response = await apis.get('site');
    dispatch({type: 'GET_SITES', payload: response.data});
}

export const getSitesByCategory = (category) => async dispatch => {
    let response = await apis.get(`site/category/find/${category}`);
    dispatch({type: 'GET_SITES', payload: response.data});
}

export const getSite = id => async dispatch => {
    let response = await apis.get(`site/${id}`);
    dispatch({type: 'GET_SITE', payload: response.data});
}

export const addSite = (name, content, category, jwt) => async dispatch => {
    let response = await apis.post('site/add', {name, content, category}, {headers: {token: jwt}});
    dispatch({type: 'ADD_SITE', payload: response.data});
}

export const updateSite = (id, name, content, category, jwt) => async dispatch => {
    let response = await apis.put(`site/${id}`, {name, content, category}, {headers: {token: jwt}});
    dispatch({type: 'UPDATE_SITE', payload: response.data});
}

export const deleteSite = (id, jwt) => async dispatch => {
    let response = await apis.delete(`site/${id}`, {headers: {token: jwt}});
    dispatch({type: 'DELETE_VARIANT', payload: response.data});
}
