import { connect } from 'react-redux';
import { requestLogin, requestSignup, clearErrors } from '../actions/authActions';
import AuthorizationForm from '../components/auth/AuthorizationForm';

const mapStateToProps = state => ({
  loginError: state.authorization.loginError,
  signupError: state.authorization.signupError,
  serverError: state.authorization.serverError,
});

const mapDispatchToProps = dispatch => ({
  requestLogin: data => dispatch(requestLogin(data)),
  requestSignup: data => dispatch(requestSignup(data)),
  clearErrors: () => dispatch(clearErrors()),
});

const AuthorizationFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorizationForm);

export default AuthorizationFormContainer;
