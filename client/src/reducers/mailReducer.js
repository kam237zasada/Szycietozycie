export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'MESSAGE_ORDER':
                return action.payload;
            case 'PRODUCT_QUESTION':
                return action.payload;
            default: 
                return state;
        }
    };