'use strict'


import React from 'react';

import IventsOfDay from './day.jsx';
import IventsOfWeek from './week.jsx';
import IventsOfMonth from './month.jsx';
import CreateEvent from './create-event.jsx';
import FullEvent from './full-event.jsx';
import Error from './error.jsx';

import {getThisEvents, sortEvents, getEventDate} from '../get-events.js';
import requests from '../requests.js';


const MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000,
      MS_IN_MIN = 60000;

let todayEvents = [];


const EventsTable = React.createClass({
    getInitialState: function() {
        return {
            events: [],
            eventId: '',
            visEventForm: this.props.visEventForm,
            visFullEvent: false,
            visError: false
        }
    },

    componentWillReceiveProps: function(nextProps) {
        let state = this.state;
        state.visEventForm = nextProps.visEventForm;
        getThisEvents.call(this, state, nextProps);
    },

    componentWillMount: function() {
        getThisEvents.call(this);

        let start = new Date().getTime(),
            end = start + MS_IN_DAY + MS_IN_HOUR,
            timerId = setInterval(requests.getDayEvents.call(this, start, end), MS_IN_DAY);
    },

    getArrOfEvents: function(res, startMS, endMS) {
        let arrSort = sortEvents(res, startMS, endMS),
            state = this.state;

        state.events = arrSort;
        this.setState(state);
    },

    updateEvents: function() {
        let start = new Date().getTime(),
            end = start + MS_IN_DAY + MS_IN_HOUR;
        getThisEvents.call(this);
        requests.getDayEvents.call(this, start, end);
    },

    getArrOfDayEvents: function(res, start, end) {
        let arrSort = sortEvents(res, start, end);
        todayEvents = arrSort;
    },

    clearForm: function(e) {
        let target = e.target;
        if (target.className === 'button create') {
            let state = this.state;
            state.eventId = '';
            this.setState(state);
        }
    },

    changeFullEvent: function(e) {
        let target = e.target;

        if (target.className === 'button edit') {
            let state = this.state;

            state.visEventForm = true;
            state.visFullEvent = false;
            state.eventId = target.getAttribute('data-event');
            this.setState(state);

        } else if (target.className === 'button delete') {
            requests.deletEvent.call(this, this.state.selEvent.id);

            let state = this.state;
            state.visFullEvent = false;
            this.setState(state);
        }
    },

    viewFullEvent: function(e) {
        let target = e.target,
        state = this.state;

        if (target.className.indexOf('event ') >= 0) {
            let id = target.id.replace(/-\d*/, ''),
                startDateMS = +target.getAttribute('data-start'),
                selEvent = this.state.events.filter(v => v.id === id && v.start_date === startDateMS)[0];

            if (this.state.selEvent
            && this.state.selEvent.id === id
            && this.state.selEvent.start_date === startDateMS) {
                state.visFullEvent = !this.state.visFullEvent;
            } else {
                state.visFullEvent = true;
            }

            state.selEvent = selEvent;

        } else {
            state.visFullEvent = false;
        }

        this.setState(state);
    },

    changeVisError: function(e) {
        let state = this.state;

        if (e && e.target.className === 'fa fa-times') {
            state.visError = false;
        } else {
            state.visError = true;
        }

        this.setState(state);
    },

    componentDidMount: function() {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else {
            Notification.requestPermission().then(function(permission) {
                if (permission === "granted") {
                    let timerId = setInterval(getNotification, 1000);
                }
            });
        }
    },

    render: function() {
        let body;
        if (this.props.period === 'day') {
            body = <IventsOfDay selDate={this.props.selDate} events={this.state.events} scope={this} />
        } else if (this.props.period === 'week') {
            body = (<IventsOfWeek selDate={this.props.selDate} events={this.state.events} scope={this} />);
        } else if (this.props.period === 'month') {
            body = <IventsOfMonth selDate={this.props.selDate} startDateMS={this.state.startDateMS}
                                  lastDateOfMonthMS={this.state.lastDateOfMonthMS} events={this.state.events}
                                  scope={this} />;
        }

        let editableEvent,
            eventId = this.state.eventId;
        if (this.state.eventId !== '') {
            editableEvent = this.state.events.filter(function(value) {
                return value.id === eventId;
            })[0];
        };

        return (
            <div>
                <div className='main-block' onClick={this.viewFullEvent}>
                    {body}
                </div>
                <div onClick={this.clearForm}>
                    <CreateEvent visible={this.state.visEventForm} scope={this}
                        editableEvent={editableEvent} />
                </div>
                <div onClick={this.changeFullEvent}>
                    <FullEvent visible={this.state.visFullEvent} scope={this}
                        selEvent={this.state.selEvent} />
                </div>
                <div onClick={this.changeVisError}>
                    <Error visible={this.state.visError} />
                </div>
            </div>
        );
    }
});


function getNotification() {
    let eventsForNotif = filterEvents();
    if (eventsForNotif !== []) createNotification(eventsForNotif);
}


function filterEvents() {
    let dateMS = new Date().getTime();

    let eventsForNotif = todayEvents.filter((value) => {
        let startNotifMS = value.start_date - 5 * MS_IN_MIN;
        return startNotifMS > dateMS && startNotifMS < dateMS + 2000;
    });

    return eventsForNotif;
}


function createNotification(arrEvents) {
    for (let i = 0; i < arrEvents.length; i++) {
        todayEvents = todayEvents.filter((value) => value.id !== arrEvents[i].id);

        let audio = new Audio();
        audio.src = 'sounds/reminder.wav';
        audio.autoplay = true;

        let evDateStr = getEventDate(arrEvents[i]),
            options = {body: evDateStr + '\n' + arrEvents[i].title,
                       icon: 'images/reminder.png'};

        let notification = new Notification('Reminder', options);
    }
}


export default EventsTable;
