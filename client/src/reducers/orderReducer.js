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
            default: 
                return state;
        }
    };