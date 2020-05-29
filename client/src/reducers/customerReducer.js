export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'CUSTOMER_LOGIN':
                return action.payload;
            case 'CUSTOMER_LOGOUT':
                return {name: '', email: ''};
            case 'GET_CUSTOMER':
                return action.payload;
            case 'ADD_CUSTOMER':
                return state;
            case 'UPDATE_CUSTOMER':
                return action.payload;
            case 'ADD_DATA':
                return action.payload;
            case 'UPDATE_CUSTOMER_PASSWORD':
                return action.payload;
            case 'DELETE_CUSTOMER':
                return state;
            default: 
                return state;
        }
    };