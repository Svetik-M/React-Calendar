const requests = {
  sendLoginForm(form) {
    const body = JSON.stringify(form);
    const scope = this;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/login');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (xhr.responseText === 'Unauthorized') {
            scope.getLogin();
          } else if (xhr.responseText === 'Success') {
            window.location = 'http://localhost:8080/user/'; // 'https://my-calendar-react.herokuapp.com/user/'; // 'http://localhost:8080/user/';
          } else {
            scope.changeVisError();
          }
        } else {
          scope.changeVisError();
        }
      }
    };

    xhr.send(body);
  },

  sendSignupForm(form) {
    const body = JSON.stringify(form);
    const scope = this;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/signup');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (xhr.responseText === 'Used') {
            scope.getSignup();
          } else if (xhr.responseText === 'Success') {
            window.location = 'http://localhost:8080/user/'; // 'https://my-calendar-react.herokuapp.com/user/'; // 'http://localhost:8080/user/';
          } else {
            scope.changeVisError();
          }
        } else {
          scope.changeVisError();
        }
      }
    };

    xhr.send(body);
  },

  sendEventForm(form, id) {
    if (id === undefined) {
      const body = JSON.stringify(form);
      const scope = this;

      const xhr = new XMLHttpRequest();

      xhr.open('POST', '/add_event');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            document.getElementById('event-form').reset();
            scope.updateEvents();
          } else {
            scope.changeVisError();
          }
        }
      };

      xhr.send(body);
    } else {
      const body = JSON.stringify({ ...form, id });
      const scope = this;

      const xhr = new XMLHttpRequest();

      xhr.open('POST', '/edit_event');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            document.getElementById('event-form').reset();
            scope.updateEvents();
          } else {
            scope.changeVisError();
          }
        }
      };

      xhr.send(body);
    }
  },

  getEvents(startMS, endMS) {
    const body = JSON.stringify({
      start: new Date(startMS),
      end: new Date(endMS),
    });

    const scope = this;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/get_events');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          scope.getArrOfEvents(JSON.parse(xhr.responseText), startMS, endMS);
        } else {
          scope.changeVisError();
        }
      }
    };

    xhr.send(body);
  },

  getDayEvents(start, end) {
    const body = JSON.stringify({
      start: new Date(start),
      end: new Date(end),
    });

    const scope = this;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/get_events');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          scope.getArrOfDayEvents(JSON.parse(xhr.responseText), start, end);
        } else {
          scope.changeVisError();
        }
      }
    };

    xhr.send(body);
  },

  deletEvent(id) {
    const body = JSON.stringify({ id });
    const scope = this;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/delete_event');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          scope.updateEvents();
        } else {
          scope.changeVisError();
        }
      }
    };

    xhr.send(body);
  },
};

export default requests;
