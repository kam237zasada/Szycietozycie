export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_DISCOUNTS':
                return action.payload;
            default: 
                return state;
        }
    };