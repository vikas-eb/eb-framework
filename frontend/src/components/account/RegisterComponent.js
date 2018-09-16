import React from 'react';
import { Grid } from '@material-ui/core';
import { UserProfile } from './UserProfile'

class RegisterComponent extends React.Component {

    render() {
        return (
            <div id='registration'>
                <Grid container direction='row' className='sane-margin-from-top sane-margin-from-bottom'>
                    <Grid item xs={1} xl={3} lg={3}>
                        <Grid container direction='column' className='same-row'>
                            <Grid item></Grid>
                        </Grid>
                    </Grid>
                    <UserProfile className='same-row' />
                </Grid>
            </div>
        );
    }
};


RegisterComponent.propTypes = {
};

export default RegisterComponent;

