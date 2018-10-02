import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';


const styles = () => ({
    root: {
        flexGrow: 1,
    }
});
    
class Component extends React.Component {

    render() {
        const { classes } = this.props;
        return(<div>hello</div>)
    }
}

Component.propTypes = {
    variable: PropTypes.string
};

export default withStyles(styles)(Component)