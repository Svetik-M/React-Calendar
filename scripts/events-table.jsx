'use strict'

import React from 'react';

import {IventsOfDay} from './day.jsx';
import {IventsOfWeek} from './week.jsx';
import {IventsOfMonth} from './month.jsx';
import {CreateEvent} from './create-event.jsx';

import getEvents from './get-events.js';


const MS_IN_DAY = 86400000;


var EventsTable = React.createClass({
    getInitialState: function() {
        return {
            events: [],
            eventId: '',
            visible: this.props.visEventForm
        }
    },

    componentWillReceiveProps: function(nextProps) {
        var state = this.state;
        state.visible = nextProps.visEventForm;
        getEvents.getThisEvents.call(this, state, nextProps);
    },

    componentWillMount: function() {
        getEvents.getThisEvents.call(this);
    },

    getArrOfEvents: function(res, start, end) {
        var arrSort = getEvents.sortEvents(res, start, end),
            state = this.state;

        state.events = arrSort;
        this.setState(state);
    },

    updateEvents: function() {
        getEvents.getThisEvents.call(this);
    },

    editEvent: function(e) {
        var target = e.target;
        if (target.className === 'button edit') {
            let state = this.state;
            state.visible = true;
            state.eventId = target.getAttribute('data-event');
            this.setState(state);
            var elem = document.querySelector('.events-block .vis')
            if (elem) elem.className = 'full-event none';
        };
    },

    clearForm: function(e) {
        var target = e.target;
        if (target.className === 'create button') {
            let state = this.state;
            state.eventId = '';
            this.setState(state);
        }
    },

    render: function() {
        var body;
        if (this.props.period === 'day') {
            body = <IventsOfDay day={this.props.day} events={this.state.events} scope={this} />
        } else if (this.props.period === 'week') {
            body = (<IventsOfWeek day={this.props.day} events={this.state.events} scope={this} />);
        } else if (this.props.period === 'month') {
            body = <IventsOfMonth day={this.props.day} currDay={this.state.currDay}
                                  dateLast={this.state.dateLast} events={this.state.events} scope={this} />;
        }

        var editableEvent,
            eventId = this.state.eventId;
        if (this.state.eventId !== '') {
            editableEvent = this.state.events.filter(function(value) {
                return value.id === eventId;
            })[0];
        };

        return (
            <div  onClick={this.editEvent}>
                {body}
                <div onClick={this.clearForm}>
                    <CreateEvent visible={this.state.visible} scope={this}
                                 editableEvent={editableEvent} />
                </div>
            </div>
        );
    }
});

export {EventsTable};
