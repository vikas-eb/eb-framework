import React from 'react';
import PropTypes from 'prop-types';

class Title extends React.Component {
    render() {

        const { ...others } = this.props;

        return (<div {...others}></div>)
    }
}

Title.propTypes = {
    variable: PropTypes.string
};

export default Title
