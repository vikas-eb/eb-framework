import React from 'react';
import PropTypes from 'prop-types';
import AutoComplete from '../Autocomplete';
import { getUsers } from '../../../services/dropdowns.master';
import ComponentWrapper from '../../ComponentWrapper';


class User extends ComponentWrapper {
    
    fetchUsers = () => {
        if (this.props.onUserLoading) {
            this.props.onUserLoading();
        }
        this.setState({ showLoader: true });

        setTimeout(() => {
            getUsers().then(data => {
                if (this.props.onUserLoaded) {
                    this.props.onUserLoaded();
                }
                    if (data && data.data && Array.isArray(data.data)) {
                    const users = data.data.map(user => {
                        return {
                            Id: user.Id,
                            Name: user.FirstName + ' ' + user.LastName
                        };
                    });
                    this.setState({
                        users,
                        showLoader: false
                    });
                }
                else {
                    this.setState({
                        users: { 
                            Id: -1,
                            Name: 'Could Not load the data'
                        },
                        error: new Error('Could not get the users data. Please refresh the page and try again')
                    });
                }
            }).catch(error => {
                if (this.props.onUserLoaded) {
                    this.props.onUserLoaded();
                }
                this.setState({
                    users: { 
                        Id: -1,
                        Name: 'Could Not load the data'
                    },
                    error,
                    showLoader: false
                });
        });
            }, 2000);
    };

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            showLoader: false,
            error: null
        };

        setTimeout(() => {
            this.fetchUsers();
        }, 500); 
    }


    onUserSelected = (id, name, index) => {
        if (this.props.onUserSelected)
            this.props.onUserSelected(id, name, index);
    };

    render()
    {
        const { ...other } = this.props;

        return (
            <div>
            <AutoComplete {...other} data={this.state.users} onItemSelected={this.onUserSelected} label='Select User'/>
            {   this.state.error && this.showError('User', this.state.error, () => {
                this.setState({ error: {} });
                })
            }
            {
                this.state.showLoader && this.showLoader()
            }
            </div>
        );
    }
}


User.propTypes = {
    onUserSelected: PropTypes.func,
    onUserLoading: PropTypes.func,
    onUserLoaded: PropTypes.func,
    id: PropTypes.string,
};


export default User;