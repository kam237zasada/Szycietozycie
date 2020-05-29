export default (
    state = {},
    action) => {
        switch (action.type) {
            case 'ADD_SHIPMENT':
                return action.payload;
            case 'GET_SHIPMENT':
                return action.payload;
            case 'UPDATE_SHIPMENT':
                return action.payload;
            case 'DELETE_SHIPMENT':
                return action.payload;
            default: 
                return state;
        }
    };