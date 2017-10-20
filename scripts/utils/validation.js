function checkField(field, value) {
  const namesRegExp = /^[a-z0-9_-]+$/i;
  const regExps = {
    Login: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i,
    Password: /^[a-z0-9]{7,15}$/i,
  };
  const regExp = regExps[field] || namesRegExp;

  return regExp.test(value);
}

function validateField(field, value) {
  const fieldValue = value.trim();

  const error = !fieldValue && `empty${field}`
    || !checkField(field, fieldValue) && `invalid${field}`
    || null;

  return { iaValid: !error, error };
}

export function validateLogin(value) {
  validateField('Login', value);
}

export function validatePassword(value) {
  validateField('Password', value);
}

export function validateFirstName(value) {
  validateField('FirstName', value);
}

export function validateLastName(value) {
  validateField('LastName', value);
}

export function validateTitle() {
  if (!this.state.eventData.title.trim()) {
    this.state.invalid = 'Please, enter the event title';
    return false;
  }

  this.state.invalid = '';
  return true;
}

export function validateCategory() {
  if (this.state.eventData.category === '') {
    this.state.invalid = 'Please, select the event category';
    return false;
  }

  this.state.invalid = '';
  return true;
}

export function validateDate() {
  const startDateMS = new Date(this.state.eventData.startDate).getTime()
    + (+this.state.start_time);
  const endDateMS = new Date(this.state.eventData.endDate).getTime() + (+this.state.end_time);

  if (startDateMS > endDateMS) {
    this.state.invalid = 'The begining of the event must be no later then the and of the event';
    return false;
  }

  this.state.invalid = '';
  return true;
}

export function validateEventForm() {
  return validateTitle.call(this)
    && validateCategory.call(this)
    && validateDate.call(this);
}
