import { getSignalRConnection, storeSignalRConnection } from '../helpers/signalRHelper';
import { UserIsValid, TryGetToken } from '../helpers/authHelper';
import { withRouter, Link, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from '../config.json';
import Cookies from 'js-cookie';

class SampleComponent extends Component {
	static displayName = SampleComponent.name;

	constructor(props) {
		super(props);
		this.state = {
			input: '',
			textArea: '',
			inputValidationError: '',
			textAreaValidationError: '',
			result: ''
		};
		this.checkForm = this.checkForm.bind(this);
		this.postForm = this.postForm.bind(this);
	}

	checkForm(event) {
		event.preventDefault();

		if (UserIsValid(this.props.auth)) {
			event.target.myButton.disabled = true;
			event.target.myButton.value = "Please wait...";
			this.postForm(event);
		}
		else {
			alert('There was an issue when you logged in. Please logout and try again.');
		}
	}

	postForm(event) {
		var inputValidation = '';
		var textAreaValidation = '';
		var validate = false;

		if (this.state.input === '') {
			event.target.myButton.disabled = false;
			inputValidation = 'Please enter something in this input.';
			validate = true;
		}

		if (this.state.textArea === '') {
			event.target.myButton.disabled = false;
			textAreaValidation = 'Please enter something in this text area.';
			validate = true;
		}

		if (validate) {
			this.setState({
				inputValidationError: inputValidation,
				textAreaValidationError: textAreaValidation
			});
			return false;
		}
		else {
			// sample fetch:
			fetch(config.AUTHENTICATED_SAMPLE_POST_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': TryGetToken(this.props.auth.user) // Need this for every request to endpoints that use Authorization.
				},
				body: JSON.stringify({ Name: this.state.input, Wishlist: this.state.textArea })
			});
			// .then((response) => {
				// return response.json();
			// })
			// .then(data => {
				// Do something with 'data':

				// Invoke SignalR endpoint to redistribute data; this would invoke the endpoint for people connected to the Home component - the .on() listener:
				// this.props.signalR.connection.invoke(config.SIGNALR_SAMPLE_GET)
			// })
			// .catch(error => {
				// console.error(error);
				// alert('An error has occurred. Please refresh the page and try again.');
			// });
			event.target.myButton.disabled = false;
			this.setState({
				result: "You entered: '" + this.state.input + "' and '" + this.state.textArea + "'.",
				input: '',
				textArea: '',
				inputValidationError: '',
				textAreaValidationError: ''
			});
		}
	}

	render() {
		return (
			<div>
				{UserIsValid(this.props.auth) ? (
					<form onSubmit={this.checkForm}>
						<div className="form-horizontal">
							<h2>This is a sample component for 2019's Opportunity Hack!</h2>

							<br />

							<p>Here is a sample link to the home component: <Link to="/">this link</Link>.</p>

							{Cookies.get('User-Email') == null ? (<p>The cookie named 'User-Email' doesn't exist.</p>) : (<p>Here is the value of the 'User-Email' cookie: <strong>{Cookies.get('User-Email')}</strong>!</p>)}

							<hr />

							<div className="form-group">
								<label className="control-label col-md-2 custom-label">Input Example:</label>
								<div className="col-md-10">
									<input
										className="form-control text-box single-line user-input"
										id="Input1"
										name="Input1"
										placeholder="Sample input placeholder"
										type="text"
										value={this.state.input}
										maxLength="50"
										onChange={(e) => this.setState({ input: e.target.value.slice(0, 50) })} />
									<div style={{ color: 'red', marginTop: '5px' }}>
										{this.state.inputValidationError}
									</div>
								</div>
							</div>

							<div className="form-group">
								<label className="control-label col-md-2 custom-label">Text Area Example:</label>
								<div className="col-md-10">
									<textarea
										className="form-control user-input"
										cols="20"
										id="TextArea1"
										name="TextArea1"
										placeholder="Sample text area placeholder"
										rows="4"
										type="text"
										value={this.state.textArea}
										maxLength="500"
										onChange={(e) => this.setState({ textArea: e.target.value.slice(0, 500) })} />
									<div style={{ color: 'red', marginTop: '5px' }}>
										{this.state.textAreaValidationError}
									</div>
								</div>
							</div>

							<div className="form-group">
								<div className="col-md-offset-2 col-md-10">
									<input type="submit" value="Submit" name="myButton" id="myButton" className="btn btn-default custom-blue" />
								</div>
							</div>

							<br />

							{this.state.result}

						</div>
					</form>
				) : (
					<Redirect
						to={{
							pathname: '/login',
							state:
							{
								from: this.props.location
							}
						}}
					/>
					)}
			</div>
		);
    }

	componentDidMount = () => {
		// Try/Get SignalR connection:
        getSignalRConnection(this.props.signalR, config.SIGNALR_SAMPLE_HUB)
            .then((conn) => {
                this.props.storeSignalRConnection(conn);
			})
			.catch(error => console.error(error));
	}

	componentWillUnmount() {

	}
};

const mapStateToProps = (state) => {
	return {
        auth: state.auth,
        signalR: state.signalR
	};
};

const mapDispatchToProps = (dispatch) => {
    return {
        storeSignalRConnection: (connection) => {
            dispatch(storeSignalRConnection(connection));
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SampleComponent));