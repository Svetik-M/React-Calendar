import { connect } from 'react-redux';
import { requestLogin } from '../actions/authActions';
import Login from '../components/auth/Login';

const mapStateToProps = state => ({
  loginError: state.loginError,
});

const mapDispatchToProps = dispatch => ({
  requestLogin: data => dispatch(requestLogin(data)),
});

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default LoginContainer;
