import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as validation from '../../utils/validation';
import { requestLogin } from '../../actions/authorizationActions';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
      isValidLogin: false,
      isValidPassword: false,
      loginError: '',
      passwordError: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const form = {
      username: this.state.login,
      password: this.state.password,
    };

    requestLogin(form);
  }

  render() {
    return (
      <div id="login">
        <h2>Welcome Back!</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="field-wrap">
            <label>
              <i className="fa fa-user" aria-hidden="true" />
              <input
                type="email"
                ref={(el) => { this.login = el; }}
                className={classNames('login', { error: this.state.loginError })}
                onBlur={validation.validLogin}
                onChange={validation.validAuthForm}
                defaultValue=""
                placeholder="E-mail Address"
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
                ref={(el) => { this.password = el; }}
                className={`password${this.state.mesPassword ? ' error' : ''}`}
                onBlur={validation.validPass}
                onChange={validation.validAuthForm}
                defaultValue=""
                placeholder="Password"
              />
            </label>
            <div>
              <div className="message">
                Password must be 7-15 characters, including letters and numbers
              </div>
              <div className="err">{this.state.mesPassword}</div>
            </div>
          </div>

          <button
            type="submit"
            className={this.state.valid ? 'button' : ' button-block'}
            disabled={!this.state.valid}
            formNoValidate
          >
            Log In
          </button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  scope: PropTypes.object.isRequired,
};

export default Login;
