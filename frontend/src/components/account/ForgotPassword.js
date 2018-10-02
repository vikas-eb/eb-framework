import React from 'react';
import ComponentWrapper from '../ComponentWrapper';
import FormattedTextbox from '../shared/FormattedTextbox';
import { Grid, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import * as userTypes from '../../actionTypes/userTypes';
import { resetPassword } from '../../actions/userActions';

class ForgotPassword extends ComponentWrapper {
    _validated = false;

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            error: null
        };
    }


    handleChange = (event, id) => {
        this.setState({ email: event.target.value });
    };


    handleValidation = (id, validated) => {
        this._validated = validated;
    };


    resetPassword = () => {
        // proceed only if the correct input is provided

        if (this._validated) {
            resetPassword(this.state.email);
        }
    };

    
    render() {
        const { type, error, ...other } = this.props;

        return (
            <Grid id='grdForgotPassword'
                className={(this.props.className ? this.props.className : '') + ' sane-margin sane-margin-from-bottom sane-margin-from-right'}>
                <FormattedTextbox
                    id='email'
                    type='email'
                    required={true}
                    label='Enter your email to continue'
                    onChange={this.handleChange}
                    defaultValue={this.state.email}
                    showEdorment={true}
                    validated={true}
                    errorText='Please enter valid email'
                />
                <div className='full-width sane-margin-from-left sane-margin-from-top align-right'>
                    <Button color='primary' variant="contained" className='sane-margin-from-right' onClick={this.onSubmit} >
                        Reset Password
                    </Button>
                    <Button color='primary' variant="contained" className='sane-margin-from-right' onClick={this.onSubmit} >
                        Cancel
                    </Button>
                </div>

                {
                    this.state.error ? this.showError('Forgot Password', this.state.error, () => {
                        this.setState({ error: {} });
                    })
                    : ''
                }

                { type === userTypes.PASSWORD_RESET_REQUESTED && this.showLoader() }

            </Grid>
        )
    }
}

ForgotPassword.propTypes = {
    
};


const mapStateToProps = (state) => {
    const { type, error, message } = state.userReducer;
    return { type, error, message };
};


const connectedComponent = connect(mapStateToProps, { resetPassword })(ForgotPassword);
export { connectedComponent as ForgotPassword };