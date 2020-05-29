export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_STATUSES':
                return action.payload;
            default: 
                return state;
        }
    };