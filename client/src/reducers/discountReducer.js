export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_DISCOUNT':
                return action.payload;
            case 'GET_DISCOUNT':
                return action.payload;
            case 'UPDATE_DISCOUNT':
                return action.payload;
            case 'DELETE_DISCOUNT':
                return action.payload;
            default: 
                return state;
        }
    };