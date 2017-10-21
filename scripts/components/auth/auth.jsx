import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Login from './login';
import Signup from './signup';
import Error from '../../components/error';

class AuthorizationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formType: this.props.params.form,
      visible: false,
    };

    this.changeVisible = this.changeVisible.bind(this);
    this.changeVisError = this.changeVisError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      formType: nextProps.params.form,
      visible: false,
    });
  }

  getSignup() {
    this.setState({
      formType: 'signup',
      visible: true,
    });
  }

  getLogin() {
    this.setState({
      formType: 'login',
      visible: true,
    });
  }

  changeVisible() {
    this.setState(previousState => ({
      formType: previousState.formType,
      visible: false,
    }));
  }

  changeVisError(e) {
    const { state } = this;

    if (e && e.target.className === 'fa fa-times') {
      state.visError = false;
    } else {
      state.visError = true;
    }

    this.setState(state);
  }

  render() {
    let menu;
    let errorMassage;
    let form;

    if (this.state.formType === 'login') {
      menu = (
        <ul className="form-group">
          <li className="form">
            <Link href="/signup">Sign Up</Link>
          </li>
          <li className="form active">Log In</li>
        </ul>
      );

      errorMassage = 'Incorrect E-mail Address or Password';
      form = <Login />;
    } else if (this.state.formType === 'signup') {
      menu = (
        <ul className="form-group">
          <li className="form active">Sign Up</li>
          <li className="form">
            <Link className="link" href="/login">Log In</Link>
          </li>
        </ul>
      );

      errorMassage = 'User already exists, please Log in';
      form = <Signup scope={this} />;
    }

    return (
      <div className="authorization">
        <div>
          <div className="logo">My Calendar</div>
          <div className="reg-form">
            {menu}
            {form}
          </div>
          <div className={`incorrect${this.state.visible ? '' : ' none'}`}>
            <div>
              <i className="fa fa-times" aria-hidden="true" onClick={this.changeVisible} />
              <div>
                <i className="fa fa-exclamation-triangle" aria-hidden="true" />
                {errorMassage}
              </div>
            </div>
          </div>
          <div onClick={this.changeVisError}>
            <Error visible={this.state.visError} />
          </div>
        </div>
      </div>
    );
  }
}

AuthorizationForm.propTypes = {
  params: PropTypes.object.isRequired,
};

export default AuthorizationForm;
