import React from 'react';
import ComponentWrapper from './ComponentWrapper';
import { withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import ForgotPassword from './account/ForgotPassword';
import ChangePassword from './account/ChangePassword';

const styles = () => ({

});

export const uiType = {
    register: 1,
    changePassword: 2,
    forgotPassword: 3
};

/**
 * for making a consistent ui throughout the application, it makes sense to have a single placeholder which will eventually contain the actually component. This component will provide the framework for a consistent UI. I am planning to provide a dialog container for the edit UIs, so it will have a dialog looks
 */


class EditUIContainer extends ComponentWrapper {

    dataState = { 
        new: 1,
        edit: 2,
        saving: 3,
        saved: 4,
    };


    constructor (props) {
        super(props);

        this.state = {
            uiType: '',
            dialogOpen: true,
            saveCalled: false,
            cancelCalled: false,
            dirty: false,
            allowEdit: false,
            dataState: -1,
            id: -1
        };
    }


    getEditUI = (ui) => {
        switch(ui) {
            case uiType.register:
                return '';
            case uiType.forgotPassword:
                return <ForgotPassword />;
            case uiType.changePassword:
                return <ChangePassword />;
        }
    };

    
    componentWillReceiveProps = (nextProps) => {
        this.setState({
            dialogOpen: true
        });
    };

    /**
     * this will be the entry form editing, so we can identify if a form is dirty
     */
    formEdited = () => {
        this.setState({
            dirty: true
        });
    };
    

    canEdit = allow => {
        this.setState({
            allowEdit: allow
        });
    };


    cancel = () => {
        // show another dialog to confirm if it is dirty

        this.setState({ dialogOpen: false });
    };


    render() {
        return (
            <Dialog open={this.state.dialogOpen}>
                <div className='dialog-edit-ui' >
                    <div id='title' className='dialog-edit-ui-title'>
                        <div className='same-row'>{this.props.title}</div>
                        <div className='same-row pull-right links' onClick={this.cancel}><i className='material-icons'>close</i></div>
                    </div>
                    <div id='body'>
                        {this.props.component}
                    </div>
                    <div id='footer' className='pull-down dialog-edit-ui-footer'>
                        {this.state.allowEdit ? 
                         <div className='same-row'>
                         <i className='material-icons locked same-row'>lock_open</i>
                         <span className='small-font  same-row'>(click to )</span>
                         </div>
                         : 
                         <div className='same-row'>
                         <i className='material-icons locked same-row'>lock</i>
                         <span className='small-font same-row'>(click to unlock )</span>
                         </div>
                        }
                        <div class='pull-right same-row' >
                            <Button disabled={this.state.dirty === false} color='primary' variant="contained" className=' sane-margin-from-bottom' onClick={this.test}>
                                Save
                            </Button>

                            &nbsp;
                            &nbsp;

                            <Button color='secondary' className=' sane-margin-from-bottom' onClick={this.test}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }
};

export default withStyles(styles)(EditUIContainer);