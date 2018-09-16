import ComponentWrapper from "./ComponentWrapper";


class EditUIFooter extends ComponentWrapper {

    constructor(props) {
        super(props);

        this.state = {
            saveCalled: false,
            cancelCalled: false,
            dirty: false,
            allowEdit: false,
            dataState: -1,
            id: -1
        };
    }


    render() {
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
    }
}

export default EditUIFooter;