function getQueryString(params) {
  return Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
}

function getfetchoptions(method, body, additionalOptions) {
  return {
    method,
    body,
    credentials: 'same-origin',
    ...additionalOptions,
  };
}

export function GET(url, params) {
  const fullUrl = params ? url : `${url}?${getQueryString(params)}`;
  return fetch(fullUrl, getfetchoptions('GET'));
}

export function POST(url, body) {
  return fetch(url, getfetchoptions('POST', body));
}

export function PUT(url, body) {
  return fetch(url, getfetchoptions('PUT', body));
}

export function DELETE(url, params) {
  const fullUrl = params ? url : `${url}?${getQueryString(params)}`;
  return fetch(fullUrl, getfetchoptions('DELETE'));
}
