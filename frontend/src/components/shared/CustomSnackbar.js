import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Snackbar } from '@material-ui/core';
import '../../css/dialog.css';


const styles = theme => {
	/** inject any style */
};

class CustomSnackbar extends React.Component {

	_killSnackbar = true;

	initialState = {
		openSnackbar: true
	};


	constructor(props) {
		super(props);
		console.log('constie');
		this.state = this.initialState;
	};


	componentWillUnmount = () => {
		this._killSnackbar = false;
	}


	handleAction = () => {
		this.setState({
			openSnackbar: false
		});
	};


	render() {

		//close after two seconds?

		setTimeout(() => {
			if (!this._killSnackbar) return; 
			this.setState({
				openSnackbar: false
			});
		}, 2000);

		return (
			<Snackbar
				open={this.state.openSnackbar}
				onClose={this.handleAction}
				ContentProps={{
					'aria-describedby': 'message-id',
				}}
				message={<span id="message-id">{this.props.message}</span>}
			/>

		);
	}
}


export default withStyles(styles)(CustomSnackbar);
