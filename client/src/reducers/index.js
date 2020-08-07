import { combineReducers } from 'redux';
import adminReducer from './adminReducer';
import fetchProducts from './fetchProducts';
import productReducer from './productReducer';
import fetchCategories from './fetchCategories';
import categoryReducer from './categoryReducer';
import fetchAdmins from './fetchAdmins';
import fetchCustomers from './fetchCustomers';
import customerReducer from './customerReducer';
import fileReducer from './fileReducer';
import fetchNewCode from './fetchNewCode';
import fetchBaskets from './fetchBaskets';
import basketReducer from './basketReducer';
import fetchShipments from './fetchShipments';
import shipmentReducer from './shipmentReducer';
import paymentReducer from './paymentReducer';
import fetchPayments from './fetchPayments';
import orderReducer from './orderReducer';
import fetchOrders from './fetchOrders';
import statusReducer from './statusReducer';
import fetchStatuses from './fetchStatuses';
import mailReducer from './mailReducer';
import colorReducer from './colorReducer';
import fetchColors from './fetchColors';
import variantReducer from './variantReducer';
import fetchVariants from './fetchVariants';
import fetchPaczkomaty from './fetchPaczkomaty'
import fetchDiscounts from './fetchDiscounts';
import discountReducer from './discountReducer';
import fetchSites from './fetchSites';
import siteReducer from './siteReducer';



export default combineReducers({
    admin: adminReducer,
    admins: fetchAdmins,
    customer: customerReducer,
    customers: fetchCustomers,
    products: fetchProducts,
    product: productReducer,
    categories: fetchCategories,
    category: categoryReducer,
    file: fileReducer,
    code: fetchNewCode,
    baskets: fetchBaskets,
    basket: basketReducer,
    shipment: shipmentReducer,
    shipments: fetchShipments,
    payment: paymentReducer,
    payments: fetchPayments,
    order: orderReducer,
    orders: fetchOrders,
    status: statusReducer,
    statuses: fetchStatuses,
    mail: mailReducer,
    variant: variantReducer,
    variants: fetchVariants,
    color: colorReducer,
    colors: fetchColors,
    paczkomaty: fetchPaczkomaty,
    discount: discountReducer,
    discounts: fetchDiscounts,
    site: siteReducer,
    sites: fetchSites
});

