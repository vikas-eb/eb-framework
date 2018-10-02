import React from 'react';
import { Grid } from '@material-ui/core';
import { UserProfile } from './UserProfile'
import Header from '../shared/Header'

class RegisterComponent extends React.Component {
    render() {
        console.log('the props: ', this.props);
        return (
            <div id='registration'>
                <Header title='Register Form' guardedCall={false} />
                <Grid container direction='row' className='sane-margin-from-top sane-margin-from-bottom'>
                    <Grid item xs={1} xl={3} lg={3}>
                    </Grid>
                    <Grid item xs={11} xl={5} lg={5}>
                        <div className='text-middle links'>Register below or <a href ='/#/login' className='primary-color'>Login</a> if you already have an account</div> 
                    </Grid>
                </Grid>
                <Grid container direction='row' className='sane-margin-from-top sane-margin-from-bottom'>
                    <Grid item xs={1} xl={3} lg={3}>
                        <Grid container direction='column' className='same-row'>
                            <Grid item></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={10} xl={5} lg={5}>
                    <UserProfile className='same-row' onCancelClicked={() => {
                        this.props.history.goBack();
                    }} />
                    </Grid>
                </Grid>
            </div>
        );
    }
};


RegisterComponent.propTypes = {
};

export default RegisterComponent;

