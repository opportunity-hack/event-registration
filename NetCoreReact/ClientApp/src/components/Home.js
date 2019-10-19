import { getSignalRConnection, storeSignalRConnection } from '../helpers/signalRHelper';
import { UserIsValid } from '../helpers/authHelper';
import { withRouter, Link } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from '../config.json';
import Cookies from 'js-cookie';

class Home extends Component {
	static displayName = Home.name;
	
	constructor(props) {
		super(props);
        this._ismounted = false;
        this.printPage = this.printPage.bind(this);
	}

	printPage() {
		window.print();
	}

	render() {
		const date = new Date();
		return (
			<div className="form-horizontal">
				<h2>Opportunity Hack {date.getFullYear()}!</h2>

				<hr />

				{UserIsValid(this.props.auth) && Cookies.get('User-Email') != null ? (<p>Welcome, <strong>{Cookies.get('User-Email')}</strong>!</p>) : ('')}
				<p>.NET Core 3.0 + React-Redux + ML.NET = Awesomeness</p>

				<div className="form-horizontal">
					<center>
						<button className="btn btn-primary hidden-print custom-blue" onClick={this.printPage}><span className="glyphicon glyphicon-print" aria-hidden="true"></span> Print</button>
					</center>
				</div>
			</div>
		);
	}
    
	componentDidMount = () => {
		// Try/Get SignalR connection:
        this._ismounted = true;
        getSignalRConnection(this.props.signalR, config.SIGNALR_SAMPLE_HUB)
            .then((conn) => {
				this.props.storeSignalRConnection(conn);
				// Create a listener:
				// conn.on(config.SIGNALR_SAMPLE_GET, (data) => {
					// Sample TODO with 'data':
					// if (this._ismounted) {
						// let participants = data.participants.map(name => { return { value: name, display: name } })
						// this.setState({ participantNames: [{ value: '', display: 'Please Select Your Name' }].concat(participants) });
					// }
				// });
				// Invoke the endpoint (which will set off the listener):
                // conn.invoke(config.SIGNALR_SAMPLE_GET);
            })
            .catch(error => console.error(error));
    }

    componentWillUnmount() {
        this._ismounted = false;
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
        storeSignalRConnection: (url) => {
            dispatch(storeSignalRConnection(url));
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
