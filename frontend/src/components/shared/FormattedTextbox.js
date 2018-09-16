import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import * as util from '../../util/util';

const styles = () => ({
    root: {
        width: '90%',
        marginTop: '0px',
        marginLeft: '0px',
    },
});


class FormattedTextbox extends React.Component {

    validated = (type, value) => {
        let validated = true;
        
        if (this.props.required) {
            validated = validated && ((value || '' ) + '').length > 0;
        }

        if (type && type.toLowerCase() === 'email' && value) {
            validated = validated && util.validateEmailFormat(value);
        }

        else if (type && type.toLowerCase() === 'number' && value) {
            validated = validated && util.validateNumber(value);
        }

        else if (type && type.toLowerCase() === 'password' && value) {
            validated = validated && util.validatePassword(value);
        }

        else if (type && type.toLowerCase() === 'confirm-password' && value) {
            validated = validated && this.props.password === value;
        }

        else if (type && (type.toLowerCase() === 'date' || type.toLowerCase() === 'datetime') && value){
            validated = validated && util.validateDate(value);
        }

        return validated;
    };


    getTextColor = () => {
        let color = this.props.color || '#346d91';

        let validated = this.validated(this.props.type, this.props.defaultValue);

        if (this.props.onValidated) {
            this.props.onValidated(this.props.id, validated);
        }

        if (!this.props.defaultValue && !this.props.submitCalled) {
            // the box is empty, and user has not tried to hit enter. No need to show freaking red color yet

            return color;
        }

        return validated ? color : 'red';
    };


    handleChange = (event) => {
        if (this.props.onChange) this.props.onChange(event, this.props.id);
    };


    render() {
        const { classes } = this.props;
        return (
            <span id={'span_'+this.props.id}>
            <TextField
                type={this.props.type === 'confirm-password' ? 'password' : this.props.type}
                required={this.props.required} 
                className={[classes.root, (this.props.className ? this.props.className : '' )].join(' ')}
                select={this.props.select}
                label={this.props.label}
                id={this.props.id}
                label={this.props.label}
                onChange={this.handleChange}
                defaultValue={this.props.defaultValue}
                value={this.props.value}
                InputLabelProps={{
                    style: {
                      color: this.getTextColor(),
                      fontSize: '13px',
                    },
                    shrink: this.props.type === 'date' ? true : undefined
                }}
                >
                    {
                        this.props.selectOptions ? (
                            this.props.selectOptions.map(option => {
                                return (
                                <option onClick={this.handleChange} key={option} value={option}>
                                    {option}
                                </option>
                                );
                            })
                        )
                    : ''
                    }
                </TextField> 
                
                <br />
                {
                    this.props.errorText && this.getTextColor() === 'red' && this.props.defaultValue  ?<span className='sane-margin-from-left small-font danger'>{this.props.errorText} </span>
                    : ''
                }
            </span>
        );
    };


}
export default withStyles(styles)(FormattedTextbox);