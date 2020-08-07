export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADMIN_LOGIN':
                return action.payload;
            case 'ADMIN_LOGOUT':
                return {};
            case 'GET_ADMIN':
                return action.payload;
            case 'ADD_ADMIN':
                return state;
            case 'UPDATE_ADMIN':
                return action.payload;
            case 'UPDATE_ADMIN_PASSWORD':
                return action.payload;
            case 'DELETE_ADMIN':
                return state;
            default: 
                return state;
        }
    };