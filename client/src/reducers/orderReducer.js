export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_ORDER':
                return action.payload;
            case 'GET_ORDER':
                return action.payload;
            case 'UPDATE_ORDER_STATUS':
                return action.payload;
            case 'UPDATE_PRIVATE_COMMENT':
                return action.payload;
            case 'UPDATE_MESSAGES':
                return action.payload;
            default: 
                return state;
        }
    };