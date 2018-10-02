import React from 'react';
import ComponentWrapper from './ComponentWrapper';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Header from './shared/Header';


class DashboardComponent extends ComponentWrapper {

    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            open: false
        };
    }


    render = () => {
        // should be logged in
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
    return {};
};

export default connect(mapStateToProps)(DashboardComponent);
//export default connect(null, { createPost })(PostForm);
