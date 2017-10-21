function checkField(field, value) {
  const namesRegExp = /^[a-z0-9_-]+$/i;
  const regExps = {
    login: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i,
    password: /^[a-z0-9]{7,15}$/i,
  };
  const regExp = regExps[field] || namesRegExp;

  return regExp.test(value);
}

function validateField(field, value) {
  const fieldValue = value.trim();

  const error = !fieldValue && `${field}Empty`
    || !checkField(field, fieldValue) && `${field}Invalid`
    || null;

  return { isValid: !error, error };
}

export function login(value) {
  return validateField('login', value);
}

export function password(value) {
  return validateField('password', value);
}

export function firstName(value) {
  return validateField('firstName', value);
}

export function lastName(value) {
  return validateField('lastName', value);
}

export function title(value) {
  return validateField('title', value);
}

export function category(categoryName) {
  const error = !categoryName.trim() ? 'categoryUnselected' : null;

  return { isValid: !error, error };
}

export function period(startDateMS, endDateMS) {
  const error = startDateMS > endDateMS ? 'periodInvalid' : null;

  return { isValid: !error, error };
}
