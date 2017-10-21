import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as validator from '../../utils/validator';
import labelsUtil from '../../utils/labelsUtil';

const formFields = ['firstName', 'lastName', 'login', 'password'];

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      login: '',
      password: '',
      firstNameIsValid: false,
      lastNameIsValid: false,
      loginIsValid: false,
      passwordIsValid: false,
      firstNameError: null,
      lastNameError: null,
      loginError: null,
      passwordError: null,
    };

    this.onHandleBlur = this.onHandleBlur.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
  }

  onHandleChange(e) {
    const { value, name } = e.target;
    this.validateForm(value, name, true);
  }

  onHandleBlur(e) {
    const { value, name } = e.target;
    this.validateForm(value, name, false);
  }

  onHandleSubmit(e) {
    e.preventDefault();

    const form = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      username: this.state.login,
      password: this.state.password,
    };

    this.props.requestSignup(form);
  }

  validateForm(value, name, changeValue) {
    const { isValid, error } = validator[name](value);

    this.setState(() => {
      const newState = { [`${name}IsValid`]: isValid };

      if (changeValue) {
        newState[name] = value;
      }
      if (!changeValue || !error) {
        newState[`${name}Error`] = labelsUtil(error);
      }

      return newState;
    });
  }

  render() {
    const isButtonEnabled = formFields.every(field => this.state[`${field}IsValid`]);

    return (
      <div id="signup">
        <h2>{labelsUtil('signupFormTitle')}</h2>

        <form onSubmit={this.onHandleSubmit}>
          <div className="top-row">
            <input
              type="text"
              name="firstName"
              className={classNames('firstName', { error: this.state.firstNameError })}
              onBlur={this.onHandleBlur}
              onChange={this.onHandleChange}
              value={this.state.firstName}
              placeholder={labelsUtil('firstNamePlaceholder')}
            />
            <input
              type="text"
              name="lastName"
              className={classNames('lastName', { error: this.state.lastNameError })}
              onBlur={this.onHandleBlur}
              onChange={this.onHandleChange}
              value={this.state.lastName}
              placeholder={labelsUtil('lastNamePlaceholder')}
            />
            <div className="err">
              {this.state.firstNameError}
            </div>
            <div className="err">
              {this.state.lastNameError}
            </div>
          </div>

          <div className="main">
            <input
              type="email"
              name="login"
              className={classNames('login', { error: this.state.loginError })}
              onBlur={this.onHandleBlur}
              onChange={this.onHandleChange}
              value={this.state.login}
              placeholder={labelsUtil('loginPlaceholder')}
            />
            <div className="err">
              {this.state.loginError}
            </div>
          </div>

          <div className="main">
            <input
              type="password"
              name="password"
              className={classNames('password', { error: this.state.passwordError })}
              onBlur={this.onHandleBlur}
              onChange={this.onHandleChange}
              value={this.state.password}
              placeholder={labelsUtil('passwordPlaceholder')}
            />
            <div>
              <div className="message">
                {labelsUtil('loginformMessage')}
              </div>
              <div className="err">{this.state.passwordError}</div>
            </div>
          </div>

          <button
            type="submit"
            className={isButtonEnabled ? 'button' : ' button-block'}
            disabled={!isButtonEnabled}
            formNoValidate
          >
            {labelsUtil('signupButton')}
          </button>
        </form>
      </div>
    );
  }
}

Signup.propTypes = {
  requestSignup: PropTypes.func.isRequired,
};

export default Signup;
