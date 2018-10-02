import { connect } from 'react-redux';
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


const mapStateToProps = (state) => {
    const { type, error } = state.reducer;
    return { type, error };
};


const connectedComponent = withStyles(styles)(connect(mapStateToProps, { })(Component));
export { connectedComponent as Component };