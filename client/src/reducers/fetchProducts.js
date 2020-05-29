export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_PRODUCTS':
                return action.payload;
            case 'GET_PRODUCTS_BY_CATEGORY':
                return action.payload;
            case 'GET_PRODUCTS_BY_QUERY':
                return action.payload;
            
            default: 
                return state;
        }
    };