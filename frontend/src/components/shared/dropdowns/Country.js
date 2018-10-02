import React from 'react';
import PropTypes from 'prop-types';
import AutoComplete from '../Autocomplete';
import { getCountries } from '../../../services/dropdowns.master';


class Country extends React.Component {
    
    fetchCountries = () => {
        getCountries().then(data => {
            this.setState({ data });
        });
    };

    constructor(props) {
        super(props);

        this.state = {
            data: []
        };

        this.fetchCountries();
    }


    onCountrySelected = (id, name, index) => {
        if (this.props.onCountrySelected)
            this.props.onCountrySelected(id, name, index);
    };


    render()
    {
        return (
            <AutoComplete className={this.props.className} id={this.props.id} data={this.state.data} onItemSelected={this.onCountrySelected} label='Select Country'/>
        );
    }
}


Country.propTypes = {
    onCountrySelected: PropTypes.func,
    id: PropTypes.string
};


export default Country;