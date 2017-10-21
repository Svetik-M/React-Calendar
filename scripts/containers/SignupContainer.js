import { connect } from 'react-redux';
import { requestSignup } from '../actions/authActions';
import Signup from '../components/auth/Signup';

const mapStateToProps = state => ({
  signupError: state.signupError,
});

const mapDispatchToProps = dispatch => ({
  requestSignup: data => dispatch(requestSignup(data)),
});

const SignupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup);

export default SignupContainer;
