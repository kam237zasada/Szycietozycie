export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'FILE_UPLOAD':
                return action.payload;
            default: 
                return state;
        }
    };