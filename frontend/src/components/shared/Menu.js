import React from 'react';
import PropTypes from 'prop-types';
import { Hidden } from '@material-ui/core';
import ComponentWrapper from '../ComponentWrapper';

class Navigation extends ComponentWrapper {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            open: false
        };
    }


    handleClose = event => {
        this.setState({
            anchorEl: null,
            open: false
        });
    }


    render() {
        return (
            <div className='no-margin'>
            </div>
        );
    }
}


export default Navigation;
