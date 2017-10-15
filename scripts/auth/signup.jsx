import React from 'react';

import validation from '../validation';
import request from '../requests';


const Signup = React.createClass({
  getInitialState() {
    validation.validFirstName = validation.validFirstName.bind(this);
    validation.validLastName = validation.validLastName.bind(this);
    validation.validLogin = validation.validLogin.bind(this);
    validation.validPass = validation.validPass.bind(this);
    validation.validAuthForm = validation.validAuthForm.bind(this);

    return {
      mesFirstN: '',
      mesLastN: '',
      mesEmail: '',
      mesPassword: '',
    };
  },

  handleSubmit(e) {
    e.preventDefault();

    const form = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      username: this.login.value,
      password: this.password.value,
    };

    request.sendSignupForm.call(this.props.scope, form);
  },

  render() {
    return (
      <div id="signup">
        <h2>Sign Up for Free</h2>

        <form onSubmit={this.handleSubmit}>
          <div className="top-row">
            <input
              type="text"
              ref={(el) => { this.firstName = el; }}
              className={`firstName${this.state.mesFirstN ? ' error' : ''}`}
              onBlur={validation.validFirstName}
              onChange={validation.validAuthForm}
              defaultValue=""
              placeholder="First Name*"
            />
            <input
              type="text"
              ref={(el) => { this.lastName = el; }}
              className={`lastName${this.state.mesLastN ? ' error' : ''}`}
              onBlur={validation.validLastName}
              onChange={validation.validAuthForm}
              defaultValue=""
              placeholder="Last Name*"
            />
            <div className="err">
              {this.state.mesFirstN}
            </div>
            <div className="err">
              {this.state.mesLastN}
            </div>
          </div>

          <div className="main">
            <input
              type="email"
              ref={(el) => { this.login = el; }}
              className={`login${this.state.mesEmail ? ' error' : ''}`}
              onBlur={validation.validLogin}
              onChange={validation.validAuthForm}
              defaultValue=""
              placeholder="E-mail Address*"
            />
            <div className="err">
              {this.state.mesEmail}
            </div>
          </div>

          <div className="main">
            <input
              type="password"
              ref={(el) => { this.password = el; }}
              className={`password${this.state.mesPassword ? ' error' : ''}`}
              onBlur={validation.validPass}
              onChange={validation.validAuthForm}
              defaultValue=""
              placeholder="Set A Password*"
            />
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
            Get Started
          </button>
        </form>
      </div>
    );
  },
});

export default Signup;
