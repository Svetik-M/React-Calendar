'use strict'

import React from 'react';
import {Event} from './event.jsx';
import {CreateEvent} from './create-event.jsx';
import requests from './request.js';


const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MS_IN_DAY = 86400000;


var titleTable = Array.from({length:7});
titleTable = titleTable.map(function(v,i) {
    return (<td key={i} className='event'>
               {DAYS_OF_WEEK[i]}
           </td>);
});


var Week = React.createClass({
    getInitialState: function() {
        return {
            events: Array.from({length:7})
        }
    },

    componentWillReceiveProps: function(nextProps) {
        getEventsSortByDays.call(this, nextProps.events);
    },

    componentWillMount: function() {
        getEventsSortByDays.call(this, this.props.events);
    },

    render: function() {
        var firstDay = this.props.currDay,
            month = this.props.day.getMonth(),
            dateFirst = new Date(this.props.day.getFullYear(), month, 1),
            events = this.state.events,
            allDays = Array.from({length: 7}),
            today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            call = this;

        events = events.map(function(value, index) {
            if (value === undefined) {
                return value;
            } else {
                let arr = value.map(function(item) {
                    var start = new Date(item.start_date).toLocaleString('en-US',
                                {hour: '2-digit', minute: '2-digit'}).toLowerCase().replace(' ', '');
                    if (new Date(item.start_date).getTime() < (firstDay + index * MS_IN_DAY)) start = '12:00am';
                    return <Event key={item.id} event={item} start={start} scope={call.props.scope} />;
                });

                return arr;
            }
        });

        allDays = allDays.map(function(v, i) {
            var date = new Date(firstDay + i*MS_IN_DAY),
                thisDay = date.getDate(),
                thisDayMs = date.getTime();

            if (date.getMonth() !== month) {
                return (<td key={i} className='other-month' id={thisDayMs}>
                            <div className='day'>{thisDay}</div>
                            {events[i]}
                        </td>);
            } else  if (thisDayMs === today.getTime()) {
                return (<td key={i} className='curr-month today' id={thisDayMs}>
                            <div className='day'>{thisDay}</div>
                            {events[i]}
                        </td>);
            } else {
                return (<td key={i} className='curr-month' id={thisDayMs}>
                            <div className='day'>{thisDay}</div>
                            {events[i]}
                        </td>);
            }
        });
        return  (
            <tr>
                {allDays}
            </tr>
        );
    }
});


var Month = React.createClass({
    render: function() {
        var currDay = this.props.currDay,
            events = this.props.events,
            weeks = [];

        for (let n = 1; currDay <= this.props.dateLast; currDay = currDay + 7*MS_IN_DAY, n++) {
            let eventsWeek = events.filter(function(value) {
                return new Date(value.start_date).getTime() >= currDay
                       && new Date(value.start_date).getTime() < currDay + 7*MS_IN_DAY
                       || new Date(value.end_date).getTime() >= currDay
                       && new Date(value.end_date).getTime() < currDay + 7*MS_IN_DAY
                       || new Date(value.start_date).getTime() < currDay
                       && new Date(value.end_date).getTime() >= currDay + 7*MS_IN_DAY;
            });
            weeks.push(
                <Week key = {n} currDay={currDay} day={this.props.day} events={eventsWeek}
                    scope={this.props.scope} />
            );
        }

        return (
            <tbody className='monthTable'>
                {weeks}
            </tbody>
        );
    }
});


var IventsOfMonth = React.createClass({
    getInitialState: function() {
        return {
            currDay: '',
            dateLast: '',
            events: [],
            eventId: '',
            visible: this.props.visEventForm
        }
    },

    componentWillReceiveProps: function(nextProps) {
        var state = this.state;
        state.visible = nextProps.visEventForm;
        this.setState(state);
        if (this.props.day.getMonth() !== nextProps.day.getMonth()) {
            getEventsOfMonth.call(this, nextProps);
        };
    },

    componentWillMount: function() {
        getEventsOfMonth.call(this, this.props);
    },

    getArrOfEvents: function(res) {
        var arrOfEvents = res.map(function(value) {
            value.start_date = new Date(value.start_date).getTime();
            value.end_date = new Date(value.start_date).getTime();
            return value;
        });
        arrOfEvents.sort(function(a, b) {
            //a.start_date < b.start_date ? -1 : a.start_date > b.start_date ? 1 : 0;
            return a.start_date - b.start_date;
        });
        this.setState({events: arrOfEvents});
    },

    updateEvents: function() {
        getEventsOfMonth.call(this, this.props);
    },

    editEvent: function(e) {
        var target = e.target;
        if (target.className === 'button edit') {
            let state = this.state;
            state.visible = true;
            state.eventId = target.getAttribute('data-event');
            this.setState(state);
            var elem = document.querySelector('.events-block .vis');
            console.log(elem);
            if (elem) elem.className = 'full-event none';
        };
    },

    hidingForm: function(e) {
        var target = e.target;
        if (target.className === 'button') {
            let state = this.state;
            state.visible = false;
            state.eventId = '';
            this.setState(state);
        }
    },

    render: function() {
        var editableEvent,
            eventId = this.state.eventId;
        if (this.state.eventId !== '') {
            editableEvent = this.state.events.filter(function(value) {
                return value.id === eventId;
            })[0];
        };

        return (
            <div className='events-block'>
                <table className='date'>
                    <tbody>
                        <tr>
                            {titleTable}
                        </tr>
                    </tbody>
                </table>
                <table className='event-list month' onClick={this.editEvent}>
                    <thead>
                        <tr>
                            {titleTable}
                        </tr>
                    </thead>
                    <Month day={this.props.day} currDay={this.state.currDay} dateLast={this.state.dateLast}
                           events={this.state.events} scope={this} />
                </table>
                <div onClick={this.hidingForm}>
                    <CreateEvent visible={this.state.visible} scope={this}
                                 editableEvent={editableEvent} />
                </div>
            </div>
        )
    }
});


function getEventsOfMonth(props) {
    var month = props.day.getMonth(),
        year = props.day.getFullYear(),
        lastDayOfMonth = new Date(year ,month+1, 0).getDate(),
        dateLast = new Date(year, month, lastDayOfMonth),
        DOW_last = dateLast.getDay(),
        dateFirst = new Date(year, month, 1),
        DOW_first = dateFirst.getDay(),
        currDay = dateFirst.getTime() - DOW_first * MS_IN_DAY,
        timeZone = new Date(props.day).getTimezoneOffset()*60*60*100,
        start = currDay,
        end = dateLast.getTime() + (6 - DOW_last) * MS_IN_DAY;

    requests.getEvents.call(this, start, end);
    var state = this.state;
    state.currDay = currDay;
    state.dateLast = dateLast.getTime();
    this.setState(state);
}

function getEventsSortByDays(eventsArr) {
    var arrOfEvents = Array.from({length:7}),
        date = this.props.currDay,
        optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'};

    for (let i = 0; i < 7; i++) {
        let arr = eventsArr.filter(function(value) {
            let start = new Date(new Date(value.start_date).toLocaleString('en-US', optionsDate)).getTime(),
                end = new Date(new Date(value.end_date).toLocaleString('en-US', optionsDate)).getTime(),
                day = new Date(date + i * MS_IN_DAY).getTime();
            return start === day ||
                   end === day ||
                   start < day && end > day;
        });
        arrOfEvents[i] = arr;
    };
    this.setState({events: arrOfEvents});
}


export {IventsOfMonth};
