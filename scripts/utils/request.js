function getQueryString(params) {
  return Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
}

function getfetchOptions(method, body) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  return {
    method,
    body: JSON.stringify(body),
    headers,
    credentials: 'same-origin',
  };
}

export function GET(url, params) {
  const fullUrl = params ? url : `${url}?${getQueryString(params)}`;
  return fetch(fullUrl, getfetchOptions('GET'));
}

export function POST(url, body) {
  return fetch(url, getfetchOptions('POST', body));
}

export function PUT(url, body) {
  return fetch(url, getfetchOptions('PUT', body));
}

export function DELETE(url, params) {
  const fullUrl = params ? url : `${url}?${getQueryString(params)}`;
  return fetch(fullUrl, getfetchOptions('DELETE'));
}
