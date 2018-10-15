import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import { Redirect } from 'react-router';
import { LoginComponent } from './components/account/LoginComponent';
import { AccessManagement } from './components/AccessManagement';
import RegisterComponent from './components/account/RegisterComponent';
import DashboardComponent from './components/DashboardComponent';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import VerifyActivationHash from './components/VerifyActivationHash';

import {
	HashRouter,
	Switch,
	Route,
	Link
} from 'react-router-dom';

const theme = createMuiTheme({
	palette: {
		primary: { main: "#346d91" },
		secondary: { main: '#8c2547' }
	},
});

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<React.Fragment>
					<CssBaseline />
					<MuiThemeProvider theme={theme}>
						<div className="App">
							<main>
								<HashRouter>
									<Switch>
										<Route path='/login' component={LoginComponent} />
										<Route path='/register' component={RegisterComponent} />
										<Route path='/dashboard' component={DashboardComponent} />
										<Route path='/access' component={AccessManagement} />
										<Route path='/verify/:hash' component={VerifyActivationHash} />
										<Route exact path="/" render={() => (
												<Redirect to="/dashboard" />
										)} />
									</Switch>
								</HashRouter>
							</main>

							<div className='pullDown footer' >Built with proud in <a target='blank' href='http://wwww.ebframework.com'>EB Framework</a></div> 
						</div>
					</MuiThemeProvider>
				</React.Fragment>
			</Provider>
		);
	}
}

export default App;
