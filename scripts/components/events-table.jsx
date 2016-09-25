'use strict'


import React from 'react';

import IventsOfDay from './day.jsx';
import IventsOfWeek from './week.jsx';
import IventsOfMonth from './month.jsx';
import CreateEvent from './create-event.jsx';
import FullEvent from './full-event.jsx';

import getEvents from '../get-events.js';
import requests from '../requests.js';


const MS_IN_DAY = 86400000;


const EventsTable = React.createClass({
    getInitialState: function() {
        return {
            events: [],
            eventId: '',
            visEventForm: this.props.visEventForm,
            visFullEvent: false
        }
    },

    componentWillReceiveProps: function(nextProps) {
        let state = this.state;
        state.visEventForm = nextProps.visEventForm;
        getEvents.getThisEvents.call(this, state, nextProps);
    },

    componentWillMount: function() {
        getEvents.getThisEvents.call(this);
    },

    getArrOfEvents: function(res, start, end) {
        let arrSort = getEvents.sortEvents(res, start, end),
            state = this.state;

        state.events = arrSort;
        this.setState(state);
    },

    updateEvents: function() {
        getEvents.getThisEvents.call(this);
    },

    clearForm: function(e) {
        let target = e.target;
        if (target.className === 'create button') {
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
            requests.deletEvent.call(this, this.state.currEvent.id);

            let state = this.state;
            state.visFullEvent = false;
            this.setState(state);

        } else if (target.className === 'fa fa-times') {
            let state = this.state;
            state.visFullEvent = false;
            this.setState(state);
        }
    },

    viewFullEvent: function(e) {
        let target = e.target,
        state = this.state;

        if (target.className.includes('event ')) {
            let id = target.id.replace(/-\d*/, ''),
                startDate = +target.getAttribute('data-start'),
                currEvent;

            currEvent = this.state.events.find(v => v.id === id && v.start_date === startDate);

            if (this.state.currEvent
            && this.state.currEvent.id === id
            && this.state.currEvent.start_date === startDate) {
                state.visFullEvent = !this.state.visFullEvent;
            } else {
                state.visFullEvent = true;
            }

            state.currEvent = currEvent;

        } else {
            state.visFullEvent = false;
        }

        this.setState(state);
    },

    render: function() {
        let body;
        if (this.props.period === 'day') {
            body = <IventsOfDay day={this.props.day} events={this.state.events} scope={this} />
        } else if (this.props.period === 'week') {
            body = (<IventsOfWeek day={this.props.day} events={this.state.events} scope={this} />);
        } else if (this.props.period === 'month') {
            body = <IventsOfMonth day={this.props.day} currDay={this.state.currDay}
                                  dateLast={this.state.dateLast} events={this.state.events} scope={this} />;
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
                <div onClick={this.viewFullEvent}>
                    {body}
                </div>
                <div onClick={this.clearForm}>
                    <CreateEvent visible={this.state.visEventForm} scope={this}
                        editableEvent={editableEvent} />
                </div>
                <div onClick={this.changeFullEvent}>
                    <FullEvent visible={this.state.visFullEvent} scope={this}
                        currEvent={this.state.currEvent} />
                </div>
            </div>
        );
    }
});


export default EventsTable;
