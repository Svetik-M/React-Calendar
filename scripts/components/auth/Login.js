import React, { Component } from 'react';
import PropTypes from 'prop-types';

import labelsUtil from '../../utils/labelsUtil';
import Input from '../../ui-kit/Input';

const formFields = ['login', 'password'];
const fieldsProps = {
  login: { type: 'email', icon: 'fa-user' },
  password: { type: 'password', icon: 'fa-lock' },
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
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
      username: this.state.login,
      password: this.state.password,
    };

    this.props.requestLogin(form);
  }

  renderInput(name) {
    return (
      <Input
        className="field-wrap"
        key={name}
        type={fieldsProps[name].type}
        name={name}
        onChange={this.onHandleChange}
        value={this.state[name]}
        placeholder={`${name}Placeholder`}
        icon={fieldsProps[name].icon}
      />
    );
  }


  render() {
    // TODO: Rewrite classes according to BEM methodology
    const isButtonEnabled = formFields.every(field => this.state[`${field}IsValid`]);
    const fields = formFields.map(this.renderInput);

    return (
      <div id="login">
        <h2>{labelsUtil('loginFormTitle')}</h2>
        <form onSubmit={this.onHandleSubmit}>
          {fields}
          <div className="message">{labelsUtil('loginformMessage')}</div>
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
