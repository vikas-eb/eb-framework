import React from 'react';
import ComponentWrapper from './ComponentWrapper';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Header from './shared/Header';
import { EBTable } from './shared/eb-table/EBTable';
import { getUsers } from '../actions/userActions';

class DashboardComponent extends ComponentWrapper {

    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            open: false,

            columns: [{
                name: 'Id',
                type: 'string',
                width: '300px'
            },
            {
                name: 'FirstName',
                type: 'string',
            },
            {
                name: 'LastName',
                type: 'string'
            },
            {
                name: 'Email',
                type: 'string'
            },
            {
                name: 'DOB',
                type: 'date'
            },
            {
                name: 'Gender',
                type: 'string'
            },
            // {
            //     name: 'a',
            //     type: 'string'
            // },
            // {
            //     name: 'b',
            //     type: 'string'
            // },
            // {
            //     name: 'c',
            //     type: 'string'
            // },
            // {
            //     name: 'd',
            //     type: 'string'
            // },
            ]
        };
    };


    render = () => {
        // should be logged in
        const { users, recordsCount } = this.props;

        try {
            if (!this.loggedIn()) {
                return (
                    <Redirect to="/login?ref=nouser" />
                );
            }
            else {
                return (
                    <div>
                        <Header title='Dashboard' guardedCall={true}></Header>

                        <div>
                            <EBTable
                                columns={this.state.columns}
                                url='/api/user/list'
                            ></EBTable>
                        </div>
                    </div>
                )
            }
        }
        catch(error) {
            // errored. make sure the session is clear and redirect to login.
            return (this.showError("Dashboard", error , () => {
                localStorage.clear();
                    if (this.props.errored) this.props.errored(error);
                })
            )

        }
    };
};

DashboardComponent.propTypes = {
    
};

const mapStateToProps = (state) => {
    const { users, error, type, recordsCount } = state.userReducer;
    return { users, error, type, recordsCount };
};

export default connect(mapStateToProps, { getUsers })(DashboardComponent);