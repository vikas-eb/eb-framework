import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ComponentWrapper from '../ComponentWrapper';
import FormattedTextbox from '../shared/FormattedTextbox';
import { register, Users } from '../../actions/userActions';
import * as userTypes from '../../actionTypes/userTypes';
import { constants } from '../../util/constants';
import { Grid, withStyles, Button } from '@material-ui/core';

import '../../css/user.css'


const styles = () => ({
    root: {
        flexGrow: 1,
    },


    textField: {
        width: '90%',
        marginTop: '10px',
        marginLeft: '10px',
    },


    inputLabel: {
        color: 'red'
    },


    gridBorder: {
        borderBottomColor: '#e5e6e8',
        borderBottomWidth: 'thin',
        borderBottomStyle: 'solid',
    }
});


class UserProfile extends ComponentWrapper {
    // the textbox will maintain the status
    _validated = {};

    // the file object browsed and picked by user
    _file = {};

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            title: 'Mr.',
            email: '',
            password: '',
            confirmPassword: '',
            profilePic: '',
            imageData: {},
            gender: 'Male',
            dob: '',
            address: '',
            image: constants.API_URL + '/uploads/default.png',
            submitCalled: false,
            error: {},
            showLoader: false,
        }
    };


    showTempImage = (image) => {
        var reader = new FileReader();
        var that = this;
        reader.onload = function (e) {
            that.setState({
                image: e.target.result
            });
        }

        reader.readAsDataURL(image);
    };


    profilePicChanged = ($event) => {
        if ($event.target.files && $event.target.files.length > 0) {
            this._file = $event.target.files[0];

            this.showTempImage(this._file);
        }
    };


    handleChange = (event, id) => {
        switch (id) {
            case 'email':
                this.setState({
                    email: event.target.value,
                });

                break;
            case 'password':
                this.setState({
                    password: event.target.value,
                });

                break;
            case 'confirmPassword':
                this.setState({
                    confirmPassword: event.target.value,
                });

                break;
            case 'title':
                this.setState({
                    title: event.target.value,
                });

                break;
            default:
                break;
        }
    };


    getUserFromState = () => {
        const user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            title: this.state.title,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            profilePic: this.state.profilePic,
            imageData: this.state.imageData,
            gender: this.state.gender,
            dob: this.state.dob,
            address: this.state.address,
            image: this.state.image,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            phone1: this.state.phone1,
            phone2: this.state.phone2,
            zip: this.state.zip
        };

        return user;
    }


    submitForm = ($event) => {
        debugger;
        let errorText = '';

        Object.keys(this._validated).forEach(key => {
            // false would mean the validation is failed
            if (this._validated[key] == false) {
                errorText = errorText + '<br />' + 'Invalid input found for ' + key;
            }
        });

        if (errorText !== '') {
            // error found
            errorText = 'Error Found while validating the data: ' + errorText;
            this.setState(
                {
                    error: new Error(errorText),
                    submitCalled: true
                }
            );
        }
        else {
            // all errors passed. Register user now
            this.props.register(this.state.user);
            this.setState({ submitCalled: true });
        }
    };


    onTextboxValidated = (id, validated) => {
        this._validated[id] = validated;
    };


    handleCancel = (event) => {
        this.props.Users();
    };


    render() {
        const { type, classes, user, error } = this.props;
        console.log('render: ', this.state.image);

        return (
                <Grid item xs={10} xl={5} lg={5}>
                    <Grid container direction='column' className={[classes.root, 'same-row', 'big-margin-from-bottom'].join(' ')}>
                        <Grid container direction='row' className={[classes.root, 'same-row'].join(' ')}>
                            <Grid item xs={2} xl={4} lg={2} >
                            </Grid>
                            <Grid item xs={8} xl={4} lg={8} >
                                <div className='text-middle'>
                                    <h2 style={{ height: '60px', lineHeight: '60px', color: '#346d91' }} className='text-middle bottom-border-thick-primary'>Register</h2>
                                </div>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <div id='nameContainer' className='full-width no-margin'>
                                <FormattedTextbox
                                    select={true}
                                    label="Mr/Ms"
                                    id='title'
                                    selectOptions={['Mr.', 'Mrs.', 'Miss.', 'Dr.', 'Others']}
                                    onChange={this.handleChange}
                                    value={this.state.title}
                                    onValidated={this.onTextboxValidated}
                                />
                                <FormattedTextbox
                                    type='text'
                                    label="First Name"
                                    id='firstName'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.firstName}
                                    onValidated={this.onTextboxValidated}
                                />
                            </div>
                        </Grid>

                        <Grid item>
                            <div>
                                <FormattedTextbox
                                    type='text'
                                    className={classes.textField}
                                    label="Middle Name"
                                    id='middleName'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.lastName}
                                    onValidated={this.onTextboxValidated}
                                />
                                <FormattedTextbox
                                    type='text'
                                    className={classes.textField}
                                    label="Last Name"
                                    id='lastName'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.lastName}
                                    onValidated={this.onTextboxValidated}
                                />
                            </div>
                        </Grid>

                        <Grid item>
                            <FormattedTextbox
                                required={true}
                                type='email'
                                className={classes.textField}
                                label="Email"
                                id='email'
                                onChange={this.handleChange}
                                submitCalled={this.state.submitCalled}
                                defaultValue={this.state.email}
                                onValidated={this.onTextboxValidated}
                                errorText='Invalid Email format'
                            />
                        </Grid>

                        <Grid item>
                            <div>
                                <FormattedTextbox
                                    required={true}
                                    type='password'
                                    className={classes.textField}
                                    label="Password"
                                    id='password'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.password}
                                    onValidated={this.onTextboxValidated}
                                    errorText='Minimum length 8, and should have 1 upper, 1 lower, 1 special character and 1 number.'
                                />
                                <FormattedTextbox
                                    required={true}
                                    type='confirm-password'
                                    className={classes.textField}
                                    label="Confirm Password"
                                    id='confirmPassword'
                                    password={this.state.password}
                                    onChange={this.handleChange}
                                    defaultValue={this.state.confirmPassword}
                                    onValidated={this.onTextboxValidated}
                                    errorText='the password and confirm password should match'
                                />
                            </div>
                        </Grid>

                        <Grid item>
                            <FormattedTextbox
                                type='date'
                                className={[classes.textField, 'width30'].join(' ')}
                                label="Date of birth"
                                id='dob'
                                onChange={this.handleChange}
                                defaultValue={this.state.dob}
                                onValidated={this.onTextboxValidated}
                            />
                        </Grid>

                        <Grid item>
                            <FormattedTextbox
                                className={[classes.textField, ''].join(' ')}
                                label="Address"
                                id='address'
                                onChange={this.handleChange}
                                defaultValue={this.state.address}
                                onValidated={this.onTextboxValidated}
                            />
                        </Grid>

                        <Grid item>
                            <div className='sane-margin-from-top'>
                            <FormattedTextbox
                                    className={[classes.textField, ''].join(' ')}
                                    label="State"
                                    id='address'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.address}
                                    onValidated={this.onTextboxValidated}
                                />
                                <FormattedTextbox
                                    className={[classes.textField, ''].join(' ')}
                                    label="Address"
                                    id='address'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.address}
                                    onValidated={this.onTextboxValidated}
                                />
                                <FormattedTextbox
                                    className={[classes.textField, ''].join(' ')}
                                    label="Address"
                                    id='address'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.address}
                                    onValidated={this.onTextboxValidated}
                                />
                            </div>
                        </Grid>

                        <Grid item>
                            <div className='sane-margin-from-top'>
                                <input type='file' onChange={this.profilePicChanged} />
                                <a onClick={this.uploadImage} className='links' >Upload</a>
                                <br />
                                <img id='profilePicture' className='small-square sane-margin-from-top' src={this.state.image} />
                            </div>
                        </Grid>

                        <Grid item>
                            <div className='align-right'>
                                <Button color='primary' variant='contained' className='sane-margin-from-right sane-margin-from-top' onClick={this.submitForm} >Register</Button>
                                <Button color='primary' variant='contained' className='sane-margin-from-right sane-margin-from-top' onClick={this.handleCancel} >Cancel</Button>
                            </div>
                        </Grid>
                    </Grid>

                {
                    this.showError('registeration', this.state.error, () => {
                        // nullify the error
                        this.setState({ error: {} });
                    })
                }

                {
                    this.showError('registeration', error , () => {
                        // nullify the error
                        this.setState({ error: {} });
                    })
                }

                {(type === userTypes.PROFILE_PIC_UPLOADING || type === userTypes.REGISTERING)  ? this.showLoader() : ''}
            </Grid>
        );
    }
};


UserProfile.propTypes = {
    user: PropTypes.object
};


const mapStateToProps = (state) => {
    const { type, error, user } = state.userReducer;
    return { type, error, user };
};


const connectedPage = withStyles(styles)(connect(mapStateToProps, { register, Users })(UserProfile));
export { connectedPage as UserProfile };

