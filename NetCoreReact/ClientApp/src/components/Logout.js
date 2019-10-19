import { withRouter, Redirect } from "react-router-dom";
import { logout } from '../helpers/authHelper';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Logout extends Component {
    UNSAFE_componentWillMount(){
        this.props.logout();
    }

    componentDidMount() {
        this.props.logout();
    }

    render(){
        return(
			<div>
				<Redirect to={{
					pathname: '/'
				}} />
			</div>
        );
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
		logout: () => {
			dispatch(logout());
		}
	}
};
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logout));