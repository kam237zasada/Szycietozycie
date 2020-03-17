export default (
    state = {name: ''},
    action) => {
        switch (action.type) {
            case 'LOGIN':
                return action.payload;
            case 'LOG_OUT':
                return {name: '', email: ''};
            case 'GET_ADMIN':
                return action.payload;
            default: 
                return state;
        }
    };