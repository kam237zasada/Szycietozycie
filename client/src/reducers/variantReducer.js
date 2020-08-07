export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_VARIANT':
                return action.payload;
            case 'GET_VARIANT':
                return action.payload;
            case 'UPDATE_VARIANT':
                return action.payload;
            case 'DELETE_VARIANT':
                return action.payload;
            default: 
                return state;
        }
    };