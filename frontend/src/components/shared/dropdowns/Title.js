import React from 'react';
import PropTypes from 'prop-types';
import FormattedTextbox from '../FormattedTextbox';

class Title extends React.Component {
    render() {

        const { ...other } = this.props;

        return (
            <FormattedTextbox
                select={true}
                label="Mr/Ms"
                id='title'
                selectOptions={['Mr.', 'Mrs.', 'Miss.', 'Dr.', 'Others']}
                {...other}
            />
        )
    }
}

Title.propTypes = {
    variable: PropTypes.string
};

export default Title