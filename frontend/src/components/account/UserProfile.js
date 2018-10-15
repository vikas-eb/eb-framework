import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ComponentWrapper from '../ComponentWrapper';
import FormattedTextbox from '../shared/FormattedTextbox';
import Country from '../shared/dropdowns/Country';
import Gender from '../shared/Gender';
import ImageBox from '../shared/ImageBox';
import { checkIfEmailExists, saveUser } from '../../actions/userActions';
import * as userTypes from '../../actionTypes/userTypes';
import { constants } from '../../util/constants';

import { Grid, 
    withStyles, 
    Button,
    CircularProgress,
    Hidden} from '@material-ui/core';

import '../../css/user.css'
import Title from '../shared/dropdowns/Title';


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
    _validated = {};
    _emailValidated = false;

    _verifyEmail = false;

    constructor(props) {
        super(props);

        this.state = {
            firstName: this.props.FirstName ? this.props.FirstName : '',
            lastName: this.props.LastName ? this.props.LastName : '',
            title: this.props.Title ? this.props.Title : 'Mr.',
            email: this.props.Email ? this.props.Email : '',
            password: '',
            confirmPassword: '',
            profilePic: this.props.ProfilePic ? constants.API_URL + "/uploads/" +this.props.ProfilePic : '',
            imageData: {}, // this variable will confirm whether the user has changed the image or not
            gender: this.props.Gender ? this.props.Gender : 'Male',
            dob: this.props.DOB ? this.props.DOB : '',
            address: this.props.Address ? this.props.Address : '',
            state: this.props.State ? this.props.State : '',
            city: this.props.City ? this.props.City : '',
            zip: this.props.Zip ? this.props.Zip : '',
            country: this.props.Country ? this.props.Country : 'India',
            submitCalled: false,
            error: {},
            showLoader: false,
            emailValidated: false,
        };

        console.log('state: ', this.state);
    };


    componentWillReceiveProps = nextProps => {
        console.log('props aayi: ', nextProps);
    };


    onImageSelected = (id, file) => {
        this.setState({
            [id]: file,
        });
    };


    onCountrySelected = (id, name, index) => {
        this.setState({
            country: name
        });
    };

    onBlur = (event, id) => {
        console.log('hello: ', id);

        if (id === 'email' && this._validated['email'] === true) {
            this._emailValidated = false;
            this.props.checkIfEmailExists(this.state.email);
        }
    };


    handleImageChange = (id, file) => {
        this.setState({
            [id]: file,
        });
    };


    handleChange = (event, id) => {

        this.setState({
            [id]: event.target.value,
        });


        switch (id) {
            case 'email':
                this._verifyEmail = true;
                break;
            default:
                break;
        }
    };


    getUserFromState = () => {

        const user = {
            Id: this.props.Id > 0 ? this.props.Id : undefined,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Title: this.state.title,
            Email: this.state.email,
            Password: this.state.password,
            ConfirmPassword: this.state.confirmPassword,
            ProfilePic: this.state.profilePic,
            ImageData: this.state.imageData,
            Gender: this.state.gender,
            DOB: this.state.dob,
            Address: this.state.address,
            Image: this.state.image,
            City: this.state.city,
            State: this.state.state,
            Phone1: this.state.phone1,
            Phone2: this.state.phone2,
            Zip: this.state.zip
        };

        if (this.props.Id > 0) {
            // edit form. Don't save passwords
            delete user.Password;
            delete user.ConfirmPassword;
        }

        return user;
    }


    submitForm = ($event) => {
        this.getUserFromState();
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
            this.props.saveUser(this.getUserFromState());
            this.setState({ submitCalled: true });
        }
    };


    onTextboxValidated = (id, validated) => {
        this._validated[id] = validated;
    };


    handleCancel = (event) => {
        if (this.props.onCancelClicked) {
            this.props.onCancelClicked();
        }
    };


    render() {
        const { type, classes, message, user, Id, error } = this.props;
        const profilePic = (this.state.profilePic && this.state.profilePic != '' ) ? this.state.profilePic : constants.API_URL + '/uploads/default.png';
        const showLoader = type === userTypes.REGISTERATION_REQUESTED || type === userTypes.EMAIL_CHECK_REQUESTED || type === userTypes.UPLOADING_REQUESTED;

        if (type === userTypes.EMAIL_CHECK_DOES_NOT_EXIST) this._emailValidated = true;

        if (type === userTypes.SAVE_USER_SUCCESS) {

            if (typeof Id === 'undefined') {
                return(
                    <div>
                        Registered Successfully. You will receive an email from our team. If you don't receive it, please check your spam and add letsdevindia@gmail.com to your address list so we can deliver the emails right in your inbox.
                        <br />
                        <a href='/#/login' className='links'>Click here to login</a>
                    </div>
                )
            }
            else {
                // this is for user save
            }
        }

        return (
                <Grid id='grdProfileRenderer' container direction='column' className={[classes.root, 'same-row', 'big-margin-from-bottom', (this.props.className ? this.props.className : '')].join(' ')}>
                    <Grid item>
                    <Grid container direction='row'>
                        <Grid item lg={2} xs={4}>
                            <Title 
                                    onChange={this.handleChange}
                                    value={this.state.title}
                                    onValidated={this.onTextboxValidated}
                                />
                            </Grid>
                            <Grid item xs={1} lg={1}></Grid>
                            <Grid item xs={7} lg={9}>
                                <FormattedTextbox
                                    type='text'
                                    label="First Name"
                                    id='firstName'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.firstName}
                                    onValidated={this.onTextboxValidated}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <Grid direction='row' container>
                            <Grid xs={4} lg={4} item>
                                <FormattedTextbox
                                    type='text'
                                    label="Middle Name"
                                    id='middleName'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.lastName}
                                    onValidated={this.onTextboxValidated}
                                />
                            </Grid>
                            <Grid item xs={1} lg={1}></Grid>
                            <Grid xs={7} lg={7} item>
                                <FormattedTextbox
                                    type='text'
                                    label="Last Name"
                                    id='lastName'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.lastName}
                                    onValidated={this.onTextboxValidated}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <div className='no-margin'>
                            <FormattedTextbox
                                required={true}
                                type='email'
                                label="Email"
                                id='email'
                                onChange={this.handleChange}
                                submitCalled={this.state.submitCalled}
                                defaultValue={this.state.email}
                                onValidated={this.onTextboxValidated}
                                errorText='Invalid Email format'
                                onBlur={this.onBlur}
                                showEdorment={true}
                                validated={this._emailValidated}
                                disabled={Id !== undefined}
                            />
                            { type === userTypes.EMAIL_CHECK_REQUESTED ? <CircularProgress /> : '' }
                            { type === userTypes.EMAIL_CHECK_EXISTS ? <div className='small-font danger'>{error.message}</div> : '' }
                        </div>
                    </Grid>
                    { Id === undefined && 
                        <Grid item>
                            <FormattedTextbox
                                required={true}
                                type='password'
                                label="Password"
                                id='password'
                                onChange={this.handleChange}
                                defaultValue={this.state.password}
                                onValidated={this.onTextboxValidated}
                                errorText='Minimum length 8, and should have 1 upper, 1 lower, 1 special character and 1 number.'
                                showEdorment={true}
                                validated={true}
                            />
                            <FormattedTextbox
                                required={true}
                                type='confirm-password'
                                label="Confirm Password"
                                id='confirmPassword'
                                password={this.state.password}
                                onChange={this.handleChange}
                                defaultValue={this.state.confirmPassword}
                                onValidated={this.onTextboxValidated}
                                showEdorment={true}
                                validated={true}
                                errorText='the password and confirm password should match'
                            />
                        </Grid>
                    }

                    <Grid item>
                        <FormattedTextbox
                            type='date'
                            label="Date of birth"
                            id='dob'
                            onChange={this.handleChange}
                            defaultValue={this.state.dob}
                            onValidated={this.onTextboxValidated}
                        />
                    </Grid>

                    <Grid item>
                        <FormattedTextbox
                            label="Address"
                            id='address'
                            onChange={this.handleChange}
                            defaultValue={this.state.address}
                            onValidated={this.onTextboxValidated}
                        />
                    </Grid>

                    <Grid item>
                        <div id='addressContainer' className='sane-margin-from-top full-width no-margin'>
                            <Grid container direction='row'>
                                <Grid item lg={8} xs={12}>
                                    <FormattedTextbox
                                        label="City"
                                        id='city'
                                        onChange={this.handleChange}
                                        defaultValue={this.state.city}
                                        onValidated={this.onTextboxValidated}
                                    />
                                </Grid>
                                <Grid item lg={1} xs={0}>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <FormattedTextbox
                                        label="Zip"
                                        id='zip'
                                        onChange={this.handleChange}
                                        defaultValue={this.state.zip}
                                        onValidated={this.onTextboxValidated}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container direction='row'>
                                <Grid item lg={6} xs={12}>
                                    <FormattedTextbox
                                        label="State"
                                        id='state'
                                        onChange={this.handleChange}
                                        defaultValue={this.state.state}
                                        onValidated={this.onTextboxValidated}
                                    />
                                </Grid>
                                <Hidden xsDown>
                                    <Grid item lg={1}>
                                    </Grid>
                                </Hidden>
                                <Grid item lg={5} xs={12}>
                                    <Country id='country' onCountrySelected={this.onCountrySelected} />
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>

                    <Grid item>
                        <Gender
                            className='same-row'
                            id='gender'
                            onChange={this.handleChange}
                            value={this.state.gender}
                            />
                    </Grid>

                    <Grid item>
                        <ImageBox id='imageData' image={profilePic} onChange={this.handleImageChange} ></ImageBox>
                    </Grid>

                    <Grid item>
                        <div className='align-right'>
                            <Button color='primary' variant='contained' className='sane-margin-from-right sane-margin-from-top' onClick={this.submitForm} >{Id > 0 ? 'Save' : 'Register'}</Button>
                            <Button color='primary' variant='contained' className='sane-margin-from-right sane-margin-from-top' onClick={this.handleCancel} >Cancel</Button>
                        </div>
                    </Grid>

                {
                    this.showError('registeration', this.state.error, () => {
                        // nullify the error
                        this.setState({ error: {} });
                    })
                }

                {
                    this.showError('registeration', error , () => {
                    })
                }

                { showLoader && this.showLoader() }
            </Grid>
        );
    }
};


UserProfile.propTypes = {
    user: PropTypes.object,
    userId: PropTypes.number,
    onCancelClicked: PropTypes.func
};


const mapStateToProps = (state) => {
    const { type, error, user } = state.userReducer;
    return { type, error, user };
};


const connectedPage = withStyles(styles)(connect(mapStateToProps, { checkIfEmailExists, saveUser })(UserProfile));
export { connectedPage as UserProfile };

