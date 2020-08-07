export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_COLORS':
                return action.payload;
            default: 
                return state;
        }
    };