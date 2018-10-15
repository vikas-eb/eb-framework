import { constants } from '../util/constants';
import { post, getList } from './api.base';

export const getAccessData = userId => {
    return post(`${constants.API_URL}/api/useraccess/list`, { userId }, true);
};


export const saveAccessData = (accessData, userId) => {
    return post(`${constants.API_URL}/api/userAccess`, { userId }, false);
};


