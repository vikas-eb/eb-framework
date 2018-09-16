import React from 'react';
import ComponentWrapper from './ComponentWrapper';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';


class DashboardComponent extends ComponentWrapper {

    constructor(props) {
        super(props);
    }

    render = () => {
        // should be logged in
        try {
            if (!this.loggedIn()) {
                return (
                    <Redirect to="/login?nouser" />
                );
            }
            else {
                this.props.loggedIn();
                return (
                    <h1>Dashboard page is here</h1>
                )
            }
        }
        catch(error) {
            // errored. make sure the session is clear and redirect to login.
            this.showError("Dashboard", error , () => {
                localStorage.clear();
                this.props.errored(error);
            });

        }
    };
};

DashboardComponent.propTypes = {
    
};

const mapStateToProps = (state) => {
    return {};
};

export default connect(mapStateToProps)(DashboardComponent);
//export default connect(null, { createPost })(PostForm);
