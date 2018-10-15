import * as accessManagementTypes from '../actionTypes/accessManagementTypes';
import * as accessManagementService from '../services/access.management.services';

export const dispatchAction = (dispatch, type, accessInfo, error, message) => {

    dispatch({
        type,
        accessInfo,
        message,
        error
    });
};


export const getAccessData = userId => dispatch => {
    dispatchAction(dispatch, accessManagementTypes.ACCESS_INFO_REQUESTED, null, null, null);
    const promise = accessManagementService.getAccessData(userId);

    promise.then(data => {
        if (data && !data.errorMessage) {
            dispatchAction(dispatch, accessManagementTypes.ACCESS_INFO_SUCCESS, data.data, null, data.message);
        } else {
            dispatchAction(dispatch, accessManagementTypes.ACCESS_INFO_ERROR, null, new Error(data.errorMessage), null);
        }
    }).catch(error => {
        dispatchAction(dispatch, accessManagementTypes.ACCESS_INFO_ERROR, null, error, null);
    });
};


