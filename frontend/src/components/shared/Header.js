import React from 'react';
import PropTypes from 'prop-types';
import { Hidden, Drawer } from '@material-ui/core';
import ComponentWrapper from '../ComponentWrapper';
import * as sessionManager from '../../util/sessionManager';
import { constants } from '../../util/constants';
import { Grid, Divider, Avatar, Fade, Menu, MenuItem } from '@material-ui/core'
import { UserProfile } from '../account/UserProfile';
import Redirect from 'react-router/Redirect';

class Header extends ComponentWrapper {
    _user = null;

    constructor(props) {
        super(props);

        this._user = sessionManager.getLoggedUser();

        this.state = {
            anchorEl: null,
            open: false,
            logOut: false,
            openProfile: false,
            userPic: (this._user && this._user.ProfilePic !== '') ? (constants.API_URL + '/uploads/' + this._user.ProfilePic) : ('https://images.cdn2.stockunlimited.net/clipart/female-user-icon_1602624.jpg')
        };
    };


    openProfileWindow = () => {
        this.setState({
            anchorEl: null,
            open: false,
            openProfile: true
        });
    };


    userSaved = user => {
        const userPic = (user && user.ProfilePic !== '') ? (constants.API_URL + '/uploads/' + user.ProfilePic) : ('https://images.cdn2.stockunlimited.net/clipart/female-user-icon_1602624.jpg');
        
        this.setState({ userPic });
    };


    handleClose = event => {
        this.setState({
            anchorEl: null,
            open: false
        });
    };


    logOut = event => {
        this.setState({
            anchorEl: null,
            open: false,
            logOut: true
        });

    };


    render() {
        const InfoLinks = () => {
            return (
                <div className='same-row width20'>
                    <span className='links primary-color same-row'>  +91-120-4224226 </span>
                    &nbsp;&nbsp;
                    <a href='mailto:contact@edgebits.io' className='links small-text primary-color same-row no-underline'>Contact Us</a> 
                </div>
            )
        };

        const loggedIn = this.loggedIn();
        const user = sessionManager.getLoggedUser();

        const ProfileAvatar = props => {
            const { anchorEl, open } = this.state;
    
            return (
                <div className={props.layout==='mobile'?'same-row pull-right':'same-row pull-right sane-margin-from-top'}>
                    { <Avatar
                        alt="Adelle Charles"
                        src={this.state.userPic}
                        className='links'
                        onClick={ event => {
                            this.setState({
                                anchorEl: event.currentTarget,
                                open: true
                            })
                        }}
                        aria-owns={open ? 'fade-menu' : null}
                        aria-haspopup="true"
                    /> }
                    
                    <Menu
                        className='profile-menu'
                        id="fade-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={this.handleClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={this.openProfileWindow}>My account</MenuItem>
                        <MenuItem onClick={this.handleClose}>Change Password</MenuItem>
                        <MenuItem onClick={this.logOut}>Logout</MenuItem>
                    </Menu>
                </div>
            )
        };
        

        return (
            <div className='no-margin'>
                <Drawer></Drawer>
                <Hidden xsDown>
                    <div className='full-width sane-margin-from-left bottom-border-gray'>
                        <img className='same-row' src='../../../images/logo-framework.png ' height='70px' style={{ verticalAlign: 'middle' }}/>
                        <div className='same-row width70 text-middle' id='title' ><h2 className='primary-color' >{this.props.title}</h2></div>
                        { loggedIn && this.props.guardedCall === true ? <InfoLinks /> : ''}
                        { loggedIn && this.props.guardedCall === true ? <ProfileAvatar layout='web' /> : ''}
                    </div>
                </Hidden>
            <Hidden smUp>
                <div className='full-width title same-row'>{this.props.title}</div>
                <InfoLinks />
                { loggedIn ? <ProfileAvatar layout='mobile' /> : ''}
            </Hidden>

            { loggedIn && this.props.guardedCall === true ? 
            
            <div className='full-width menu-bar'>
                <a href='/#/dashboard' className='header'>Dashboard</a>
                <div className='menu-dropdown'>
                    <a href='#' className='header'>Master</a>
                    <div className='menu-dropdown-content'>
                        <a href='/#/users' className='child'>Users</a> <br />
                        <Divider />
                        <a href='/#/products' className='child'>Products</a><br />
                        <Divider />
                        <a href='/#/productgroups' className='child'>Product Groups</a><br />
                        <Divider />
                        <a href='/#/customers' className='child'>Customers</a><br />
                        <Divider />
                        <a href='/#/suppliers' className='child'>Suppliers</a><br />
                    </div>
                </div>
            </div>
            : ''
            }

            {
                this.state.logOut && <Redirect to='login'></Redirect>
            }

            {this.state.openProfile && user ? this.showComponentInADialog(
                <Grid id='grdProfile' container className='full-width'>
                    <Grid item xs={11} lg={11} xl={11} className='big-margin-from-left'>
                        <UserProfile {...user} onUserSaved={this.userSaved} onCancelClicked={() => {
                        this.setState({ openProfile: false });
                    }} />
                    </Grid>
                </Grid>
                    , 'User Profile', action => {
                        this.setState({ openProfile: false });
                    }) : ''}
                    
        </div>

        
        );
    }
}

Header.propTypes = {
    title: PropTypes.string,
    guardedCall: PropTypes.bool.isRequired
};

export default Header;

