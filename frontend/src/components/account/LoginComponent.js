import React from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string'

import '../../css/login.css';
import '../../css/forgot.password.css';
import * as sessionManager from '../../util/sessionManager'

import TextField from '@material-ui/core/TextField';
import { Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core';

import CustomSnackBar from '../shared/CustomSnackbar';
import * as userTypes from '../../actionTypes/userTypes';
import { login, errored, initialize, loggedIn } from '../../actions/userActions'
import ComponentWrapper from '../ComponentWrapper';
import Link from 'react-router-dom/Link';
import { ForgotPassword } from './ForgotPassword';

const styles = () => ({
	root: {
        flexGrow: 1,
    },

    paper: {
        margin: '10px'
    },

    textField: {
        width: '90%',
        marginTop: '10px',
        marginLeft: '10px'
    },

    gridBorder: { 
        borderColor: 'transparent',
        borderWidth: 'thin',
        borderStyle: 'dotted',
        borderRadius: '12px'
    }
});


class LoginComponent extends ComponentWrapper {

    _showSnackbar = true;

    constructor(props){
        super(props);

        this._showSnackbar = true;

        this.state = {
            userName: 'vikas@edgebits.io',
            password: '@Shiv17291',
            currentState: 'Guest',
            showLoader: false,
            showTestForm: false,
            showResetPassowrdForm: false,
        };


        // let's clear the sessions

        sessionManager.clear();
        this.props.initialize();
    };


    resetPassword = event => {
        this._showSnackbar = false;
        this.setState({ showResetPassowrdForm: true });
    };


    handleConfirm = (action) => {

    };


    handleChange = (e) =>{
        let { userName, password } = this.state;

        switch (e.target.id) {
            case 'userName':
                userName = e.target.value;
                break;
            case 'password':
                password = e.target.value;
                break;
            default:
                break;
        }

        this.setState({ userName, password });
    };


    test = () => {
        this.setState({
            showTestForm: true
        });
    };


    onSubmit = (e) => {
        e.preventDefault();
        
        this.setState({
            currentState: 'Submitted',
            showLoader: true
        });

        this._showSnackbar = false;
        this.props.login(this.state.userName, this.state.password);
    }


    render() {
        const { userName, password} = this.state;
        const { user, classes, message } = this.props;

        let { type, error } = this.props;
        let snackbar = '';

        console.log('snackie: ', this._showSnackbar);

        if (this.props.location && this.props.location.search && this._showSnackbar) {
            const values = queryString.parse(this.props.location.search);
            if (values.ref === 'nouser') {
                snackbar = 'No Login information found. Please login again';
            }

            // hide snackbar 
            setTimeout(() => {
                this._showSnackbar = false;
            }, 2000);
        }

        try {
            if (type === userTypes.LOGIN_SUCCESS && user && user.token) {
                // logged in.
                console.log('user: ', user);
            
                sessionManager.saveToken(user.token);
                sessionManager.saveUser(user);
                sessionManager.saveEmail(user.Email);

                setTimeout(() => {
                    this.props.loggedIn();
                }, 100);

                return (<Redirect to="dashboard" />);
            }
        }
        catch(err) {
            // if error, just don't redirect
            sessionManager.clear();
            this.props.errored(err);
        }

        return (

            <div id='login' className={[classes.root, 'full-width', 'full-height', 'login-background'].join(' ')} >
                <Grid container justify='center'>
                    <Grid item xs={12} sm={4}>
                            <Grid container direction="column" justify='center'  className={[ classes.gridBorder, 'align-middle',  'login-container'].join(' ')} >
                                <Grid item>
                                    <div className='full-width text-middle' >
                                        <div className='same-row'><img src='../../images/user.png' className='login-title-image'/> <br />
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item>
                                    <TextField required label="User Name" id='userName' className={classes.textField} defaultValue={userName} onChange={this.handleChange}  />
                                </Grid>
                                <Grid item>
                                    <TextField required label="Password" id='password' className={[classes.textField, 'sane-margin-from-bottom'].join(' ')}  defaultValue={password} onChange={this.handleChange}  />
                                </Grid>
                                    
                                <Grid item className='align-right sane-margin-from-right'>
                                    <Link to='/register'className='links align-left'>Register</Link>
                                    &nbsp;
                                    <a className='links align-left' onClick={this.resetPassword}>Forgot Password</a> 
                                    <Button color='primary' variant="contained" className='sane-margin-from-left sane-margin-from-bottom text-right' onClick={this.onSubmit} >
                                        Login
                                    </Button>
                                    <Button color='primary' variant="contained" className='sane-margin-from-left sane-margin-from-bottom text-right' onClick={this.test} >
                                        try me
                                    </Button>
                                </Grid>
                            </Grid>
                        
                    </Grid>
                </Grid>

                {this._showSnackbar && snackbar && snackbar.length > 0 && <CustomSnackBar message={snackbar}/>}
                {this.showError('login', error)}
                { this.showPopup('','') }
                { type === userTypes.LOGIN_REQUESTED && this.showLoader() }
                { this.state.showResetPassowrdForm ? this.showComponentInADialog(
                    <ForgotPassword
                        className='forgot-password-panel'
                    />, 'Forgot Password') : ''}
            </div>
        );
    }
};


LoginComponent.propTypes = {
    login: PropTypes.func.isRequired,
    errored: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired
};


const mapStateToProps = (state) => {
    const { type, error, user } = state.userReducer;
    return { type, error, user };
};

const connectedLoginPage = withStyles(styles)(connect(mapStateToProps, { login, errored, loggedIn, initialize })(LoginComponent));
export { connectedLoginPage as LoginComponent };