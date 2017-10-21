import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Login from './Login';
import Signup from './Signup';
import ErrorModal from '../../ui-kit/ErrorModal';
import labelsUtil from '../../utils/labelsUtil';

function AuthorizationForm(props) {
  // TODO: Rewrite classes according to BEM methodology
  const forms = {
    login: <Login requestLogin={props.requestLogin} />,
    signup: <Signup requestSignup={props.requestSignup} />,
  };

  const formType = props.params.form;

  const errorMassage = props.loginError && 'loginError'
    || props.signupError && 'signupError'
    || props.serverError && 'serverError';

  const error = errorMassage
    ? <ErrorModal message={errorMassage} onClose={props.clearErrors} />
    : null;

  return (
    <div className="authorization">
      <div>
        <div className="logo">{labelsUtil('appName')}</div>
        <div className="reg-form">
          <ul className="form-group">
            <li className={classNames('form', { active: formType === 'signup' })}>
              <Link href="/signup">{labelsUtil('signupTab')}</Link>
            </li>
            <li className={classNames('form', { active: formType === 'login' })}>
              <Link href="/login">{labelsUtil('loginTab')}</Link>
            </li>
          </ul>
          {forms[formType]}
        </div>
        {error}
      </div>
    </div>
  );
}

AuthorizationForm.propTypes = {
  params: PropTypes.object.isRequired,
  requestLogin: PropTypes.func.isRequired,
  requestSignup: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  loginError: PropTypes.bool.isRequired,
  signupError: PropTypes.bool.isRequired,
  serverError: PropTypes.bool,
};

AuthorizationForm.defaultProps = {
  serverError: false,
};

export default AuthorizationForm;
