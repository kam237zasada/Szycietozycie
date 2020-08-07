export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_SITE':
                return action.payload;
            case 'GET_SITE':
                return action.payload;
            case 'UPDATE_SITE':
                return action.payload;
            case 'DELETE_SITE':
                return action.payload;
            default: 
                return state;
        }
    };