export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_VARIANTS':
                return action.payload;
            default: 
                return state;
        }
    };