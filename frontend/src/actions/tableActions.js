import * as api from '../services/api.base';
import * as tableTypes from '../actionTypes/tableTypes';

const dispatchAction = (dispatch, type, data, error, message, recordsCount) => {
    dispatch({
        type,
        data,
        message,
        error,
        recordsCount
    });
};

export const fetchData = (url, post) => dispatch => {
    dispatchAction(dispatch, tableTypes.EB_TABLE_DATA_REQUESTED, null, null, null);
    const promise = api.post(url, post, true);

    promise.then(data => {
        console.log('data: ', data);
        if (data && !data.errorMessage) {
            dispatchAction(dispatch, tableTypes.EB_TABLE_DATA_SUCCESS, data.data, null, data.message, data.recordsCount) ;
        } else {
            dispatchAction(dispatch, tableTypes.EB_TABLE_DATA_ERROR, null, new Error(data.errorMessage), null);
        }
    }).catch(error => {
        dispatchAction(dispatch, tableTypes.EB_TABLE_DATA_ERROR, null, error, null);
    });
};

