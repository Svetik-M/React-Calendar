'use strict'

import React from 'react';

import {Event} from './event.jsx';
import {CreateEvent} from './create-event.jsx';

import getEvents from './get-events.js';


const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      MS_IN_DAY = 86400000;


var titleTable = Array.from({length:7});
titleTable = titleTable.map(function(v,i) {
    return (<td key={i} className='events-group'>
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
        getEvents.sortMonthEventsByDays.call(this, nextProps.events);
    },

    componentWillMount: function() {
        getEvents.sortMonthEventsByDays.call(this, this.props.events);
    },

    render: function() {
        var firstDay = this.props.currDay,
            month = this.props.day.getMonth(),
            dateFirst = new Date(this.props.day.getFullYear(), month, 1),
            events = this.state.events,
            allDays = Array.from({length: 7}),
            today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            call = this;

        events = events.map(function(value, index){
            if (value === undefined) {
                return value;
            } else {
                let arr = value.map(function(item) {
                    var start;

                    if (new Date(item.start_date).getTime() < (firstDay + index * MS_IN_DAY)) {
                        start = '12:00am';
                    } else {
                        start = new Date(item.start_date).toLocaleString('en-US',
                                {hour: '2-digit', minute: '2-digit'}).toLowerCase().replace(' ', '');
                    }

                    return (<Event key={item.id} currEvent={item} events={call.props.events}
                        start={start} scope={call.props.scope} />);
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
            <tbody className='month-table'>
                {weeks}
            </tbody>
        );
    }
});


var IventsOfMonth = React.createClass({
    render: function() {
        return (
            <div className='events-block'>
                <table className='date'>
                    <tbody>
                        <tr>
                            {titleTable}
                        </tr>
                    </tbody>
                </table>
                <table className='events-list month'>
                    <thead>
                        <tr>
                            {titleTable}
                        </tr>
                    </thead>
                    <Month day={this.props.day} currDay={this.props.currDay} dateLast={this.props.dateLast}
                           events={this.props.events} scope={this.props.scope} />
                </table>
            </div>
        )
    }
});


export {IventsOfMonth};
