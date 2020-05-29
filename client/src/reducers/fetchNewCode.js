export default (
    state = '',
    action) => {
        switch (action.type) {
            case 'GET_NEW_CODE':
                return action.payload;
            default: 
                return state;
        }
    };