export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_STATUS':
                return action.payload;
            case 'GET_STATUS':
                return action.payload;
            case 'UPDATE_STATUS':
                return action.payload;
            case 'DELETE_STATUS':
                return action.payload;
            default: 
                return state;
        }
    };