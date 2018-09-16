import React from 'react';
import { connect } from 'react-redux';
import '../../css/login.css';

import TextField from '@material-ui/core/TextField';
import { Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import { login, errored, initialize } from '../../actions/userActions'
import ComponentWrapper from '../ComponentWrapper';


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


class RegisterSubForm extends ComponentWrapper {

    constructor(props){
        super(props);
    };


    render() {
        return (<div>Register yourself here</div>)
    }
}


RegisterSubForm.propTypes = {
};


const mapStateToProps = (state) => {
    const { user, status } = state.authReducer;
    return { user, status };
};

const registerPage = withStyles(styles)(connect(mapStateToProps)(RegisterSubForm));
export { registerPage as RegisterSubForm };
