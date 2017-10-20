import requests from '../utils/requests';

const actionTypes = {
  REQUEST_LOGIN: 'REQUEST_LOGIN',
  FAILURE_LOGIN: 'FAILURE_LOGIN',
};

function failureLogin() {
  return {
    type: actionTypes.FAILURE_LOGIN,
  };
}

export function requestLogin(formData) {
  requests.sendLoginForm(formData, failureLogin);
}
