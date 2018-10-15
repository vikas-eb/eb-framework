import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, withStyles, Table, TableHead, TableCell, TableRow } from '@material-ui/core';
import ComponentWrapper from './ComponentWrapper';
import { getAccessData } from '../actions/accessManagementActions';
import User from './shared/dropdowns/User';
import Header from './shared/Header';
import * as accessManagementTypes from '../actionTypes/accessManagementTypes';


const styles = () => ({
    root: {
        flexGrow: 1,
    }
});
    
class AccessManagement extends ComponentWrapper {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            accessInfo: this.props.accessInfo ? this.props.accessInfo : [],
            error: {}
        };
    }


    componentWillReceiveProps = (nextProps) => {
        this.setState({
            accessInfo: nextProps.accessInfo,
            error: nextProps.error
        });
    };


    handleCheckboxClick = (moduleName, accessType, accessValue) => event => {
        const accessCloned = JSON.parse(JSON.stringify(this.state.accessInfo));

        accessCloned.forEach(access => {
            if (access.ModuleName.toLowerCase() === moduleName.toLowerCase()) {
                // module name matched
                if (accessType === 'NoAccess') {
                    // no matter what, if this is checked or unchecked, this will always result in 
                    // a situation where we will not have any other access

                    access.MyRecordsAccess = 0;
                    access.OtherRecordsAccess = 0;
                }
                else if (accessType === 'MyAccess') {
                    if (event.target.checked) {
                        access.MyRecordsAccess = accessValue;
                    }
                    else {
                        access.MyRecordsAccess = 0;
                    }

                }
                else if (accessType === 'OtherAccess') {
                    if (event.target.checked) {
                        access.OtherRecordsAccess = accessValue;
                    }
                    else {
                        access.OtherRecordsAccess = 0;
                    }
                }
            }
            else {

            }
        });

        this.setState({ accessInfo: accessCloned });
    }


    onUserSelected = (id, name, index) => {
        this.props.getAccessData(id);
    };

    render() {
        const { classes, accessInfo, type, error } = this.props;

        return (
            <div className='sane-margin' style={{minHeight: '500px'}} >
                <Header title='Access Management Window' guardedCall={true}></Header>
                <div style={{width: '300px'}}>
                    <User id='users' onUserSelected={this.onUserSelected} />
                </div>
                { (this.state.accessInfo && this.state.accessInfo.length > 0 ) ? 
                        <Table className={classes.table}>
                            <TableHead>
                            <TableRow>
                                    <TableCell>Module Name</TableCell>
                                    <TableCell>No Access</TableCell>
                                    <TableCell colSpan={2}>My Records</TableCell>
                                    <TableCell colSpan={3}>Other Records</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>Insert</TableCell>
                                    <TableCell>Delete</TableCell>
                                    <TableCell>View</TableCell>
                                    <TableCell>Edit</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                this.state.accessInfo.map(access => {
                                    return (
                                        /**
                                         * as explained in 
                                         */
                                        access.ModuleName === 'UserAccess' ?
                                        <TableRow>
                                            <TableCell>{access.ModuleName}</TableCell>
                                            <TableCell><Checkbox checked={access.MyRecordsAccess === 0 && access.OtherRecordsAccess === 0} onChange={this.handleCheckboxClick(access.ModuleName, 'NoAccess', -1)}></Checkbox></TableCell>
                                            <TableCell colSpan={5}><Checkbox checked={access.MyRecordsAccess === 5} onChange={this.handleCheckboxClick(access.ModuleName, 'MyAccess', 5 )}></Checkbox></TableCell>
                                        </TableRow>
                                    :
                                        <TableRow>
                                            <TableCell>{access.ModuleName}</TableCell>
                                            <TableCell><Checkbox checked={access.MyRecordsAccess === 0 && access.OtherRecordsAccess === 0} onChange={this.handleCheckboxClick(access.ModuleName, 'NoAccess', -1)}></Checkbox></TableCell>
                                            <TableCell><Checkbox checked={access.MyRecordsAccess === 5} onChange={this.handleCheckboxClick(access.ModuleName, 'MyAccess', 5 )}></Checkbox></TableCell>
                                            <TableCell><Checkbox checked={access.MyRecordsAccess === 10} onChange={this.handleCheckboxClick(access.ModuleName, 'MyAccess', 10 )}></Checkbox></TableCell>
                                            <TableCell><Checkbox checked={access.OtherRecordsAccess === 5} onChange={this.handleCheckboxClick(access.ModuleName, 'OtherAccess', 5 )}></Checkbox></TableCell>
                                            <TableCell><Checkbox checked={access.OtherRecordsAccess === 10} onChange={this.handleCheckboxClick(access.ModuleName, 'OtherAccess', 10 )}></Checkbox></TableCell>
                                            <TableCell><Checkbox checked={access.OtherRecordsAccess === 15} onChange={this.handleCheckboxClick(access.ModuleName, 'OtherAccess', 15 )}></Checkbox></TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </Table>
                 : ''}

                { type === accessManagementTypes.ACCESS_INFO_REQUESTED && this.showLoader() }

                { error ? this.showError('Access Management', error, () => {

                }) : ''}

            </div>
        )
    }
}

AccessManagement.propTypes = {
};


const mapStateToProps = (state) => {
    const { type, error, accessInfo } = state.accessManagementReducer;
    return { type, error, accessInfo };
};


const connectedComponent = withStyles(styles)(connect(mapStateToProps, { getAccessData })(AccessManagement));
export { connectedComponent as AccessManagement };