'use strict'

var requests = {

    sendEventForm: function() {
        var caregory = this.refs.home.checked ? this.refs.home.value : this.refs.work.value;

        var form = {
            title: this.refs.title.value,
            start_date: this.refs.start_date.value,
            start_time: this.refs.start_time.value,
            end_date: this.refs.end_date.value,
            end_time: this.refs.end_time.value,
            place: this.refs.place.value,
            category: caregory,
            discription: this.refs.discription.value
        };

        if (this.props.action === 'add') {
            let body = JSON.stringify(form);

            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/add_event');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        document.getElementById('event-form').reset();
                    }
                }
            };

            xhr.send(body);

        } else if (this.props.action === 'edit') {
            form.id = this.props.eventId;
            let body = JSON.stringify(form);

            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/edit_event');
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        document.getElementById('event-form').reset();
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
