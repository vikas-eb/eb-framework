import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { CircularProgress, Snackbar } from '@material-ui/core';
import { Slide } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';

import '../../css/dialog.css';


const styles = theme => {
	/** inject any style */
};

class CustomDialog extends React.Component {


	emailTypes = {
		SENDING: 'sending Email',
		INITIAL_STATE: '',
		SENT: 'sent',
		EMAIL_ERROR: 'email error'
	};

	constructor(props) {
		super(props);

		this.state = {
			emailStatus: this.emailTypes.INITIAL_STATE,
			dialogOpen: true
        };
	};


	componentWillReceiveProps(nextProps) {
	}


	handleAction = action => {
		this.setState({
			dialogOpen: false
		});

		this.props.onActionTaken(action);
	};


	handleYes = () => {
		this.handleAction('yes');
	};


	handleNo = () => {
		this.handleAction('no');
	};


	handleCancel = () => {
		this.handleAction('cancel');
	};


	sendEmail = (content) => {
		//add code for sending email. May be to an api 

		this.setState({
			emailStatus: this.emailTypes.SENDING
		});

		// for fake email call, holding it for two seconds
		setTimeout(() => {
			this.setState({
				emailStatus: this.emailTypes.SENT
			});

			// we hide the sent message after 2 seconds

			setTimeout(() => {
				this.setState({
					emailStatus: this.emailTypes.INITIAL_STATE
				});	
			}, 2000);

		}, 2000);
	};

	Transition = (props) => {
		return <Slide direction="up" {...props} />;
	};


	render() {
		const zIndex = this.props.zIndex ? this.props.zIndex : 1000;
		if (this.props.messageType === 2) {
			return (
				<Dialog open={this.state.dialogOpen} aria-labelledby="simple-dialog-title" PaperProps={{
					style: {
					  backgroundColor: 'transparent',
					  boxShadow: 'none',
					},
				  }} className='transparent' >
					<div className='transparent'><CircularProgress/></div>
				</Dialog>
			);
		}
		else if (this.props.messageType === 4) {

			// 4 is custom popup, means there has to be a component supplied in props
			// it should send height/width properties

			// the open / close will be controlled by the props, not the state

			return (
				<Dialog id='dlgCustom' open={true}
					PaperProps={{
						style: {
							width: '90%',
							margin: '10px'
						}
					}}
					TransitionComponent={this.Transition}
				>
					<DialogTitle id="dialog-title" className='dialog-title'>
						<div className='same-row dialog-title-text'>{this.props.title}</div>
						<div className='same-row pull-right show-hand'>
							<a onClick={this.handleCancel}>
								<i className="material-icons">highlight_off</i>
							</a>
						</div>
					</DialogTitle>
					{this.props.element}
				</Dialog>
			)
		}
		else {

			return (
				<Dialog open={this.state.dialogOpen} aria-labelledby="simple-dialog-title">
					<DialogTitle id="dialog-title" className='dialog-title'>
						<div className='box'>
							{/* the message box icon below */}
							{ 
								this.props.messageType === 0 ? 
								<i className="material-icons same-row danger sane-margin-from-left">
									block
								</i> 
								
								: (
									this.props.messageType === 1 ?
									<i className="material-icons same-row confirm sane-margin-from-left">
										report
									</i> : ''
								)
							}

							<div className='same-row dialog-title-text'>{this.props.title}</div>
							<div className='same-row pull-right show-hand'>
								<a onClick={this.handleCancel}>
									<i className="material-icons">highlight_off</i>
								</a>
							</div>
						</div>

					</DialogTitle>

					<div className='dialog-text'>
						<div className='dialog-text-message'>{this.props.message}</div>
						<div className='dialog-text-footer'>
						{
								this.state.emailStatus === this.emailTypes.SENDING && <LinearProgress color="secondary" variant="query" />
							}

							{
								this.state.emailStatus === this.emailTypes.SENT && <span className='small-font'>Email sent successfully</span>
							}

							{
								this.state.emailStatus === this.emailTypes.EMAIL_ERROR && <span className='small-font'>Email couldn't be sent</span>
							}

							{
								this.props.messageType === 0 ?
								<Button 
									color='primary' 
									variant="contained"
									className='pull-right text-right small-font' 
									disabled={this.state.emailStatus === this.emailTypes.SENDING}
									onClick={this.sendEmail}>
										Send Email to Developer
								</Button> : ''
							}

							{
								this.props.messageType === 1 ?
								(
									<div>
										<Button 
											color='primary' 
											variant="contained"
											className='pull-right text-right small-font' 
											onClick={this.handleYes}>
											Yes
										</Button>
										<Button 
											color='primary' 
											variant="contained"
											className='pull-right text-right small-font' 
											onClick={this.handleNo}>
											No
										</Button>
									</div>
								) : ''
						}
						</div>
					</div>
				</Dialog>
			);
		}
	}
}

CustomDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	onActionTaken: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	messageType: PropTypes.number.isRequired, //0 for normal alert, 1 for confirmation, 2 for circular box
};

export default withStyles(styles)(CustomDialog);
