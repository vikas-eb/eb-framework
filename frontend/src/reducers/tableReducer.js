import * as tableTypes from '../actionTypes/tableTypes';

const initialState = {
    type: tableTypes.EB_TABLE_INITIALIZE,
    data: [],
    message: '',
    recordsCount: 0,
    error: null
};

const tableReducer = (state, action) => {
    if (typeof state === 'undefined' ) {
        return initialState;
    }


    switch(action.type) {
        case tableTypes.EB_TABLE_DATA_REQUESTED:
        return {
            type: action.type,
            data: state.data,
            recordsCount: state.recordsCount
        };
        case tableTypes.EB_TABLE_DATA_SUCCESS:
        return {
            type: action.type,
            data: action.data,
            message: action.message,
            recordsCount: action.recordsCount
        };
        case tableTypes.EB_TABLE_DATA_ERROR:
            return {
                type: action.type,
                error: action.error
            };
        default:
            return state;
    }
};


export default tableReducer;
