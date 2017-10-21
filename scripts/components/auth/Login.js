import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as validator from '../../utils/validator';
import labelsUtil from '../../utils/labelsUtil';

const formFields = ['login', 'password'];

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
      loginIsValid: false,
      passwordIsValid: false,
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
      username: this.state.login,
      password: this.state.password,
    };

    this.props.requestLogin(form);
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
      <div id="login">
        <h2>{labelsUtil('loginFormTitle')}</h2>
        <form onSubmit={this.onHandleSubmit}>
          <div className="field-wrap">
            <label>
              <i className="fa fa-user" aria-hidden="true" />
              <input
                type="email"
                name="login"
                className={classNames('login', { error: this.state.loginError })}
                onBlur={this.onHandleBlur}
                onChange={this.onHandleChange}
                value={this.state.login}
                placeholder={labelsUtil('loginPlaceholder')}
              />
            </label>
            <div className="err">
              {this.state.loginError}
            </div>
          </div>

          <div className="field-wrap">
            <label>
              <i className="fa fa-lock" aria-hidden="true" />
              <input
                type="password"
                name="password"
                className={classNames('password', { error: this.state.passwordError })}
                onBlur={this.onHandleBlur}
                onChange={this.onHandleChange}
                value={this.state.password}
                placeholder={labelsUtil('passwordPlaceholder')}
              />
            </label>
            <div>
              <div className="message">{labelsUtil('loginformMessage')}</div>
              <div className="err">{this.state.passwordError}</div>
            </div>
          </div>

          <button
            type="submit"
            className={isButtonEnabled ? 'button' : ' button-block'}
            disabled={!isButtonEnabled}
            formNoValidate
          >
            {labelsUtil('loginButtom')}
          </button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  requestLogin: PropTypes.func.isRequired,
};

export default Login;
