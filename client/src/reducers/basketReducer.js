export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_BASKET':
                return action.payload;
            case 'GET_BASKET':
                return action.payload;
            case 'UPDATE_BASKET':
                return action.payload;
            case 'DELETE_BASKET':
                return action.payload;
            default: 
                return state;
        }
    };