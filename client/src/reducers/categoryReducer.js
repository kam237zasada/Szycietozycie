export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_CATEGORY':
                return action.payload;
            case 'GET_CATEGORY':
                return action.payload;
            case 'UPDATE_CATEGORY':
                return action.payload;
            case 'DELETE_CATEGORY':
                return action.payload;
            default: 
                return state;
        }
    };