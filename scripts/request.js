'use strict'

var requests = {

    sendEventForm: function(form, id) {
            console.log(id);
            if (id === undefined) {
            let body = JSON.stringify(form),
                call = this;

            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/add_event');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
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
                        console.log(xhr.responseText);
                        document.getElementById('event-form').reset();
                        call.updateEvents()
                    }
                }
            };

            xhr.send(body);
        }

    },


    getEvents: function(start, end) {
        var body = JSON.stringify({
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString()
        });

        var call = this;

        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/get_events');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    call.getArrOfEvents(JSON.parse(xhr.responseText));
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
                    console.log(xhr.responseText);
                    call.updateEvents();

                }
            }
        }

        xhr.send(body);
    }
}

export default requests;
