export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_PRODUCT':
                return action.payload;
            case 'GET_PRODUCT':
                return action.payload;
            case 'UPDATE_PRODUCT':
                return action.payload;
            case 'DELETE_PRODUCT':
                return action.payload;
            default: 
                return state;
        }
    };