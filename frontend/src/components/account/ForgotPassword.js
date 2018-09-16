import React from 'react';
import ComponentWrapper from '../ComponentWrapper';
import { Redirect } from 'react-router';

class ForgotPassword extends ComponentWrapper {
    
    render()
    {
        if (!this.loggedIn) {
            return (
                <Redirect to="/login?ref=nouser" />
            );
        }

        return '<div>Forgot Password</div>';
    }
}

export default ForgotPassword;