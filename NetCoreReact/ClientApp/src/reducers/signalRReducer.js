const signalRReducer = (state = {
    connection: null,
    isConnected: false
}, action) => {
    switch (action.type) {
        case 'STORE_CONNECTION':
                state = { ...state, connection: action.payload, isConnected: true };
            break;
        default:
            break;
    };
    return state;
};

export default signalRReducer;