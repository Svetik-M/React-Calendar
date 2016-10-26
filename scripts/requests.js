'use strict'


let requests = {

    sendLoginForm: function(form) {
        let body = JSON.stringify(form),
            scope = this;

        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/login');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (xhr.responseText === 'Unauthorized') {
                        scope.getLogin();
                    } else if (xhr.responseText === 'Success') {
                        window.location = 'https://my-calendar-react.herokuapp.com/user';
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


    sendSignupForm: function(form) {
        let body = JSON.stringify(form),
            scope = this;

        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/signup');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (xhr.responseText === 'Used') {
                        scope.getSignup();
                    } else if (xhr.responseText === 'Success') {
                        window.location = 'https://my-calendar-react.herokuapp.com/user';
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


    sendEventForm: function(form, id) {

            if (id === undefined) {
            let body = JSON.stringify(form),
                scope = this;

            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/add_event');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
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
            form.id = id;
            let body = JSON.stringify(form),
                scope = this;

            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/edit_event');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        document.getElementById('event-form').reset();
                        scope.updateEvents()
                    } else {
                        scope.changeVisError();
                    }
                }
            };

            xhr.send(body);
        }

    },


    getEvents: function(startMS, endMS) {
        let body = JSON.stringify({
            start: new Date(startMS),
            end: new Date(endMS)
        });

        let scope = this;

        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/get_events');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    scope.getArrOfEvents(JSON.parse(xhr.responseText), startMS, endMS);
                } else {
                    scope.changeVisError();
                }
            }
        }

        xhr.send(body);
    },


    getDayEvents: function(start, end) {
        let body = JSON.stringify({
            start: new Date(start),
            end: new Date(end)
        });

        let scope = this;

        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/get_events');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    scope.getArrOfDayEvents(JSON.parse(xhr.responseText), start, end);
                } else {
                    scope.changeVisError();
                }
            }
        }

        xhr.send(body);
    },


    deletEvent: function(id) {
        console.log(id);
        let body = JSON.stringify({id: id}),
            scope = this;

        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/delete_event');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    scope.updateEvents();
                } else {
                    scope.changeVisError();
                }
            }
        }

        xhr.send(body);
    }
}


export default requests;
