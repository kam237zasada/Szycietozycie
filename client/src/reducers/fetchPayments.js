export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_PAYMENTS':
                return action.payload;
            default: 
                return state;
        }
    };