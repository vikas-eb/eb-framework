import React from 'react';
import * as sessionManager from '../util/sessionManager';
import CustomDialog from './shared/CustomDialog';
import { Redirect } from 'react-router';

export default class ComponentWrapper extends React.Component {
    _showSnackbar = false;


    constructor(props) {
        super(props);

        this.state = {
            openError: false,
            openSnackbar: false,
        }
    }


    dialogTypes = {
        error: 0,
        confirm: 1,
        loader: 2,
        popup: 3,
        custom: 4
    };


    /**
     * 
     * Logged in will ensure that the session has the token,
     * and the user object is valid or not
     */

    loggedIn = () => {
        const token = sessionManager.getToken();
        const email = sessionManager.getLoggedUserEmail();
        const user = sessionManager.getLoggedUser();

        if (!token || !email || !user) {
            // invalid session
            console.log('not logged in, returning....')
            return false;
        }

        // verify the email and user email matches. Extra check if the user has not manually injected values into local storage

        if (email !== user.Email) {
            return false;
        }

        // passed all the checks
        console.log('logged in, returning....')
        return true;
    };


    onActionTaken = (action) => {
        this.setState({
            openError: false,
            openSnackbar: false
        });
    };


    showError = (callingUI, error, handleAction) => {
        if (error && error.message) {
            return (
                <CustomDialog onActionTaken={handleAction ? handleAction : this.onActionTaken} title={'Error Found from UI: ' + callingUI} message={error.message} messageType={this.dialogTypes.error}/>
            );
        }
        else {
            return '';
        }
    };


    showConfirm = (title, message, handleAction) => {
        if (message) {
            return (
                <CustomDialog onActionTaken={handleAction ? handleAction : this.onActionTaken} title={title} message={message} messageType={this.dialogTypes.popup}/>
            );
        }
        else {
            return '';
        }
    };


    showPopup = (title, message, callback) => {
        if (message && message.trim().length > 0) {
            return '';
        }
        else {
            return '';
        }
    };

    /**
     * @param {JSX} element this will be a jsx element which will be fixed in a dialog
     * 
     */

    showComponentInADialog = (element, title, handleAction) => {
        return (
            <CustomDialog onActionTaken={handleAction ? handleAction : this.onActionTaken} title={title} element={element} messageType={this.dialogTypes.custom} />
        )
    }


    showLoader = () => {
        console.log('loader called')
        return (
            <CustomDialog onActionTaken={this.onActionTaken} title='' message='' messageType={this.dialogTypes.loader} />
        );
    };


    render() {
        return (<div />);
    }
}