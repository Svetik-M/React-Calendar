import { browserHistory } from 'react-router';

import { POST } from '../utils/request';

export const AUTH_FETCHING = 'AUTH_FETCHING';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const SIGNUP_FAILED = 'SIGNUP_FAILED';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

const authFetching = () => ({ type: AUTH_FETCHING });
const loggedIn = () => ({ type: LOGGED_IN });
const loginFailed = () => ({ type: LOGIN_FAILED });
const signupFailed = () => ({ type: SIGNUP_FAILED });

export const clearErrors = () => ({ type: CLEAR_ERRORS });

export function requestLogin(formData) {
  return (dispatch) => {
    dispatch(authFetching());

    POST('/login', formData)
      .then(res => res.text())
      .then((resText) => {
        if (resText === 'Unauthorized') {
          dispatch(loginFailed());
        }

        if (resText === 'Success') {
          dispatch(loggedIn());
          browserHistory.push('/user');
        }
      });
  };
}

export function requestSignup(formData) {
  return (dispatch) => {
    dispatch(authFetching());

    POST('/signup', formData)
      .then(res => res.text())
      .then((resText) => {
        if (resText === 'Used') {
          dispatch(signupFailed());
        }

        if (resText === 'Success') {
          dispatch(loggedIn());
          browserHistory.push('/user');
        }
      });
  };
}
