export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_COLOR':
                return action.payload;
            case 'GET_COLOR':
                return action.payload;
            case 'UPDATE_COLOR':
                return action.payload;
            case 'DELETE_COLOR':
                return action.payload;
            default: 
                return state;
        }
    };