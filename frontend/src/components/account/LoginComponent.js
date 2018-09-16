import React from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string'

import '../../css/login.css';
import * as sessionManager from '../../util/sessionManager'

import TextField from '@material-ui/core/TextField';
import { Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core';

import CustomSnackBar from '../shared/CustomSnackbar';
import { login, errored, initialize } from '../../actions/userActions'
import ComponentWrapper from '../ComponentWrapper';
import EditUIContainer from '../EditUIContainer';
import DashboardComponent from '../DashboardComponent';

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
            userName: 'vikasbhandari2@gmail.com',
            password: 'password',
            currentState: 'Guest',
            showLoader: false,
            showRegistrationForm: false,
            showResetPassowrdForm: false,
        }; 

        this.props.initialize();
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
            showRegistrationForm: true
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
        const { user, classes } = this.props;

        let { status, error } = this.props;

        let snackbar = '';


        if (this.props.location.search && this._showSnackbar) {
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
            if (status === 'loginSuccess') {
                // logged in.

                sessionManager.saveToken(user.token);
                sessionManager.saveUser(user);
                sessionManager.saveEmail(user.Email);

                return (<Redirect to="dashboard" />);
            }
        }
        catch(err) {
            // if error, just don't redirect
            debugger;
            sessionManager.clear();
            this.props.errored(err);
        }

        const dashboardComponent = <DashboardComponent />

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
                                    <a href='/register' className='links align-left'>Register</a>&nbsp;
                                    <a href='/forgotPassword' className='links align-left'>Forgot Password</a> 
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

                {this._showSnackbar && <CustomSnackBar message={snackbar}/>}
                {this.state.showRegistrationForm && <EditUIContainer component={dashboardComponent} open={true} title='Add/Edit User' /> }
                {this.showError('login', error)}
                {this.showPopup('','')}
                {status === 'requested' && this.showLoader()}
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
    debugger;
    const { status, error, user } = state.authReducer;
    return { status, error, user };
};

const connectedLoginPage = withStyles(styles)(connect(mapStateToProps, { login, errored, initialize })(LoginComponent));
export { connectedLoginPage as LoginComponent };