export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_SITES':
                return action.payload;
            default: 
                return state;
        }
    };