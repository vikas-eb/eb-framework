import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import Header from './shared/Header';
import * as userTypes from '../actionTypes/userTypes';
import { redirectToLogin, verifyActivationHash, initialize } from '../actions/userActions'
import ComponentWrapper from './ComponentWrapper';
import { Redirect } from 'react-router';

const styles = () => ({
    root: {
        flexGrow: 1,
    }
});
    
class VerifyActivationHash extends ComponentWrapper {

    render() {
        const { classes, type, error } = this.props;

        if (this.props.match.params.hash && type === userTypes.INITIALIZE) {
            this.props.verifyActivationHash(this.props.match.params.hash)
        }

        switch(type) {
            case userTypes.ACTIVATION_HASH_VERIFICATION_REQUESTED:
                return this.showLoader();
                case userTypes.ACTIVATION_HASH_VERIFICATION_NOT_FOUND:
                case userTypes.ACTIVATION_HASH_VERIFICATION_ERROR:
                return this.showError('Verifying activation', error, event => {
                });
            case userTypes.REDIRECTED_TO_LOGIN:
                // reset user status
                window.localStorage.clear();
                return (
                    <Redirect to='/login' />
                )
            case userTypes.ACTIVATION_HASH_VERIFICATION_VERIFIED:
                {
                    setTimeout(() => {
                        this.props.redirectToLogin();
                    }, 1000)
                }
                return (
                    <div>
                        <Header guardedCall={false} title='Verifying Activation Code'></Header>
                        Activation code has successfully been verified. You will not be redirected to login page.
                        <CircularProgress />
                    </div>
                );
            default:
                return <div>Verifying the code. Please stay tuned</div>
        }
    }
}

VerifyActivationHash.propTypes = {
};

const mapStateToProps = (state) => {
    const { type, error } = state.userReducer;
    return { type, error };
};


export default VerifyActivationHash = withStyles(styles)(connect(mapStateToProps, { verifyActivationHash, redirectToLogin, initialize })(VerifyActivationHash));

