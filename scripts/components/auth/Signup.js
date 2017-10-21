import React, { Component } from 'react';
import PropTypes from 'prop-types';

import labelsUtil from '../../utils/labelsUtil';
import Input from '../../ui-kit/Input';

const formFields = ['firstName', 'lastName', 'login', 'password'];
const fieldTypes = {
  login: 'email',
  password: 'password',
};

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
    };

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  onHandleChange(name, value, isValid) {
    this.setState({
      [name]: value,
      [`${name}IsValid`]: isValid,
    });
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

  renderInput(name, index) {
    return (
      <Input
        className={index > 1 ? 'main' : ''}
        key={name}
        type={fieldTypes[name]}
        name={name}
        onChange={this.onHandleChange}
        value={this.state[name]}
        placeholder={`${name}Placeholder`}
      />
    );
  }

  render() {
    // TODO: Rewrite classes according to BEM methodology
    const isButtonEnabled = formFields.every(field => this.state[`${field}IsValid`]);

    const fields = formFields.map(this.renderInput);

    return (
      <div id="signup">
        <h2>{labelsUtil('signupFormTitle')}</h2>

        <form onSubmit={this.onHandleSubmit}>
          <div className="top-row">
            {fields.slice(0, 2)}
          </div>
          {fields.slice(2)}
          <div className="message">{labelsUtil('loginformMessage')}</div>
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
