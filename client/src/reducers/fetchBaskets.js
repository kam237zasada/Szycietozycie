export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_BASKETS':
                return action.payload;
            default: 
                return state;
        }
    };