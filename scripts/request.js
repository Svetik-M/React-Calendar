'use strict'

var requests = {
    sendLoginForm: function(form) {
        var body = JSON.stringify(form),
            call = this;

        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/login');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (xhr.responseText === 'Unauthorized') {
                        call.getLogin();
                    } else if (xhr.responseText === 'Success') {
                        window.location = xhr.responseURL.replace('login', 'user');
                    }
                }
            }
        };

        xhr.send(body);
    },


    sendSignupForm: function(form) {
        var body = JSON.stringify(form),
            call = this;

        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/signup');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (xhr.responseText === 'Used') {
                        call.getSignup();
                    } else if (xhr.responseText === 'Success') {
                        window.location = xhr.responseURL.replace('signup', 'user');
                    }
                }
            }
        };

        xhr.send(body);
    },


    sendEventForm: function(form, id) {

            if (id === undefined) {
            let body = JSON.stringify(form),
                call = this;

            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/add_event');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        document.getElementById('event-form').reset();
                        call.updateEvents();
                    }
                }
            };

            xhr.send(body);

        } else {
            form.id = id;
            let body = JSON.stringify(form),
                call = this;

            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/edit_event');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        document.getElementById('event-form').reset();
                        call.updateEvents()
                    }
                }
            };

            xhr.send(body);
        }

    },


    redirectToUserPage: function() {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', '/user/');
        xhr.setRequestHeader('Content-Type', 'text/html');

        xhr.send();
    },


    getEvents: function(start, end) {
        var body = JSON.stringify({
            start: new Date(start),
            end: new Date(end)
        });

        var call = this;

        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/get_events');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    call.getArrOfEvents(JSON.parse(xhr.responseText), start, end);
                }
            }
        }

        xhr.send(body);
    },

    deletEvent: function(id) {
        console.log(id);
        var body = JSON.stringify({id: id}),
            call = this;

        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/delete_event');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    call.updateEvents();

                }
            }
        }

        xhr.send(body);
    }
}

export default requests;
