export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_PAYMENT':
                return action.payload;
            case 'GET_PAYMENT':
                return action.payload;
            case 'UPDATE_PAYMENT':
                return action.payload;
            case 'DELETE_PAYMENT':
                return action.payload;
            default: 
                return state;
        }
    };