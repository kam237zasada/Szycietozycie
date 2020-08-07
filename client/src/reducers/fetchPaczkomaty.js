export default (
    state = [],
    action) => {
        switch (action.type) {
            case 'GET_PACZKOMATY':
                return action.payload;
            default: 
                return state;
        }
    };