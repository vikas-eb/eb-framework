import React from 'react';
import ComponentWrapper from '../ComponentWrapper';
import { Redirect } from 'react-router';

class ChangePassword extends ComponentWrapper {
    
    render()
    {
        if (!this.loggedIn) {
            return (
                <Redirect to="/login?ref=nouser" />
            );
        }

        return '<div>Change Password</div>';
    }
}

export default ChangePassword;