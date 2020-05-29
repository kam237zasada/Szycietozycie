export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_ADMINS':
                return action.payload;
            default: 
                return state;
        }
    };