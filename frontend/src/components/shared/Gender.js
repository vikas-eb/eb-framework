import React from 'react';
import PropTypes from 'prop-types';
import { FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio } from '@material-ui/core';
class Gender extends React.Component {

    onChange = event => {
        if (this.props.onChange) {
            this.props.onChange(event, this.props.id);
        }
    };


    render() {
        const { onChange, ...others } = this.props;

        return (
            <FormControl id='fieldSet1' component="fieldset" className='same-row sane-margin-from-top'>
                <FormLabel id='legend' component="legend" className='small-font primary-color sane-margin-from-top'>Gender</FormLabel>
                <RadioGroup
                    name='gender'
                    onChange={this.onChange}
                    {...others}
                >
                    <FormControlLabel value="Male" control={<Radio id='Male' />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio id='Female' />} label="Female" />
                    <FormControlLabel value="Other" control={<Radio id='Other' />} label="Other" />
                </RadioGroup>
            </FormControl>
        )
    }
}


Gender.propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func
};

export default Gender
