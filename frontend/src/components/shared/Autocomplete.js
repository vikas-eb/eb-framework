import React from 'react';
import PropTypes from 'prop-types';
import { Popper, MenuList, MenuItem, Grow, Paper } from '@material-ui/core';
import '../../css/autocomplete.css';
import FormattedTextbox from './FormattedTextbox';

class AutoComplete extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            selectedValue: '',
            selectedText: '',
            menuOpen: false,
            data: this.props.data,
            anchorElement: null
        }
    }


    focusIn = (event) => {
        this.setState({
            menuOpen: true,
            anchorElement: event.currentTarget
        });
    };


    focusOut = (event) => {
        this.setState({ menuOpen: false });
    };


    getFilteredData = (textToSearch) => {
        return (this.props.data || []).filter(item => {
            return textToSearch === '' || item.Name.toLowerCase().indexOf(textToSearch.toLowerCase()) > -1;
        });
    }


    selectItem = (id, name, index) => event => {
        debugger;
        if (this.props.onItemSelected) {
            this.props.onItemSelected(id, name, index);
        }

        this.setState({
            selectedText: name,
            menuOpen: false
        });
    };


    mouseHandle = event => {
        console.log('mousie');
    };


    textChanged = (event, id) => {

        /**
         * if the entered text matches the item in dropdown, then it makes sense to 
         * fire an event to the parent screen because user may not eventually select the item after entering full text. If the item doesn't match, then we need to nullify the item selection by sending a signal that there is no item selected
         */

        const item = event.target.value;
        const items = this.getFilteredData(item);

        if (this.props.onItemSelected) {
            if (items && items.length > 0) {
                if (items[0].Name.toLowerCase() === item.toLowerCase()) {
                    this.props.onItemSelected(items[0].Id, items[0].Name, 0);
                }
            }
            else {
                this.props.onItemSelected('', '', -1);
            }
        }

        this.setState({
            selectedText: event.target.value,
            data: items
        });
    };


    render()
    {
        const stateData = this.state.data;
        const propsData = this.props.data;

        let data = stateData;

        if (this.state.selectedText === '' && stateData && stateData.length === 0) {
            data = propsData;
        }

        const ref = this;

        return (
            <div className={this.props.className}>
                <FormattedTextbox type='text' 
                    id={'text_' + this.props.id} 
                    value={this.state.selectedText}
                    onFocus={this.focusIn}
                    onBlur={this.focusOut}
                    className='full-width'
                    onChange={this.textChanged}
                    label={this.props.label}
                    />
                    {
                        <Popper 
                            id={'popper'+ this.props.id}
                            open={this.state.menuOpen}
                            anchorEl={this.state.anchorElement}
                            placement='bottom-start'
                            className='no-margin'
                            >
                            <Paper id={'paper_' + this.props.id}  className='dropdown-wrapper'>
                                { data ? 
                                    data.map((item, index) => {
                                        return <MenuItem id={item.Id} key={item.Id} onMouseDown={this.selectItem(item.Id, item.Name, index)}>{item.Name}</MenuItem>
                                    })
                                    : '' 
                                }
                            </Paper>
                        </Popper>
                        }
            </div>
        );
    }
}

AutoComplete.propTypes = {
    data: PropTypes.array.isRequired,
    onItemSelected: PropTypes.func.isRequired,
    label: PropTypes.string
};

export default AutoComplete;