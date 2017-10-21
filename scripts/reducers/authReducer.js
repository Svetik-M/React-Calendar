import { createReducer } from '../utils/reduxUtils';
import {
  AUTH_FETCHING,
  LOGGED_IN,
  LOGIN_FAILED,
  SIGNUP_FAILED,
  MODAL_CLOSED,
} from '../actions/authActions';

const initialState = {
  loginError: false,
  signupError: false,
  authFetching: false,
};

export default createReducer(initialState, {
  [AUTH_FETCHING]: authFetching,
  [LOGGED_IN]: loggedIn,
  [LOGIN_FAILED]: loginFailed,
  [SIGNUP_FAILED]: signupFailed,
  [MODAL_CLOSED]: modalClosed,
});

function authFetching(state) {
  return { ...state, authFetching: true };
}

function loggedIn(state) {
  return { ...state, authFetching: false };
}

function loginFailed(state) {
  return { ...state, signupError: false, loginError: true };
}

function signupFailed(state) {
  return { ...state, loginError: false, signupError: true };
}

function modalClosed(state) {
  return { ...state, loginError: false, signupError: false };
}
