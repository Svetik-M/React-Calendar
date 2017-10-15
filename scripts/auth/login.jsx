import React from 'react';

import validation from '../validation';
import request from '../requests';

const Login = React.createClass({
  getInitialState() {
    validation.validLogin = validation.validLogin.bind(this);
    validation.validPass = validation.validPass.bind(this);
    validation.validAuthForm = validation.validAuthForm.bind(this);

    return {
      valid: false,
      mesEmail: '',
      mesPassword: '',
    };
  },

  handleSubmit(e) {
    e.preventDefault();

    const form = {
      username: this.login.value,
      password: this.password.value,
    };

    request.sendLoginForm.call(this.props.scope, form);
  },

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
                className={`login${this.state.mesEmail ? ' error' : ''}`}
                onBlur={validation.validLogin}
                onChange={validation.validAuthForm}
                defaultValue=""
                placeholder="E-mail Address"
              />
            </label>
            <div className="err">
              {this.state.mesEmail}
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
  },
});


export default Login;
