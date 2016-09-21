'use strict'

import React from 'react';

import {Event} from './event.jsx';
import {CreateEvent} from './create-event.jsx';

import getEvents from './get-events.js';
import {getBlockTopShift} from './viewing-options.js';

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
        var arrOfEvents = getEvents.sortWeekEventsByDays(nextProps.events, nextProps.currDay);
        arrOfEvents =  getEvents.sortWeekEventsByDuration(arrOfEvents, nextProps.currDay);
        this.setState({events: arrOfEvents});
    },

    componentWillMount: function() {
        var arrOfEvents = getEvents.sortWeekEventsByDays(this.props.events, this.props.currDay);
        arrOfEvents =  getEvents.sortWeekEventsByDuration(arrOfEvents, this.props.currDay);
        this.setState({events: arrOfEvents});
    },

    render: function() {
        var firstDay = this.props.currDay,
            month = this.props.day.getMonth(),
            dateFirst = new Date(this.props.day.getFullYear(), month, 1),
            events = this.state.events,
            allDays = Array.from({length: 7}),
            today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            lastDay = new Date(firstDay + 6 * MS_IN_DAY).getDate();

        events = events.map(function(value, index) {
            var midnight = firstDay + index * MS_IN_DAY;

            let arrDay = value.map(function(val, ind) {
                if (val === undefined) {
                    return val;
                } else {
                    let arr = val.map(function(item) {
                        var startDate = item.start_date,
                            endDate = item.end_date,
                            start, coefWidth;

                        if (startDate < midnight && index !== 0) {
                            return undefined;

                        } else if (startDate < midnight && index === 0) {
                            start = '';
                            coefWidth = Math.ceil((endDate - midnight) / MS_IN_DAY);
                            if (coefWidth >  7) coefWidth = 7;

                        } else if (startDate >= midnight && startDate < midnight + MS_IN_DAY) {
                            start = new Date(startDate).toLocaleString('en-US',
                                    {hour: '2-digit', minute: '2-digit'}).toLowerCase().replace(' ', '');
                            coefWidth = Math.ceil((endDate - startDate) / MS_IN_DAY);

                            if (coefWidth >  6 - index + 1) coefWidth = 6 - index + 1;

                        } else {
                            start = new Date(startDate).toLocaleString('en-US',
                                    {hour: '2-digit', minute: '2-digit'}).toLowerCase().replace(' ', '');
                        }

                        var id  = Math.ceil(lastDay / 7) + '.' + item.id;

                        return <Event key={item.id}  id={id} events={this.props.events} currEvent={item}
                            start={start} scope={this.props.scope} midnight={midnight} coefWidth={coefWidth}
                            DOW={index} />;
                    }, this);

                    return arr;
                }
            }, this);

            return arrDay;

        }, this);

        allDays = allDays.map(function(v, i) {
            var date = new Date(firstDay + i * MS_IN_DAY),
                thisDay = date.getDate(),
                thisDayMs = date.getTime(),
                evOneDayStyle = {
                    height: 'calc(100% - (' + (events[i][0].length * 1.2 + 1.1) + 'rem + '
                            + (events[i][0].length + 2)  + 'px))'
                },
                evSomeDaysStyle;

            if (events[i][0].length > 0 && events[i][0][0] === undefined) {
                let topEl = getBlockTopShift(this.props.events, date, lastDay);
                evSomeDaysStyle = {top: topEl};
                let arr = events[i][0].filter(value => {
                    return value !== undefined;
                }),
                len = arr.length;
                evOneDayStyle.top = 'calc(' + topEl + 'px + ' + len + ' * (' + 1.2 + 'rem + ' + 2 + 'px))';
            }

            if (date.getMonth() !== month) {
                return (<td key={i} className='other-month' id={'m.' + thisDayMs}>
                            <div className='date'>{thisDay}</div>
                            <div style={evSomeDaysStyle}>{events[i][0]}</div>
                            <div style={evOneDayStyle}>{events[i][1]}</div>
                        </td>);
            } else  if (thisDayMs === today.getTime()) {
                return (<td key={i} className='curr-month today' id={'m.' + thisDayMs}>
                            <div className='date'>{thisDay}</div>
                            <div style={evSomeDaysStyle}>{events[i][0]}</div>
                            <div style={evOneDayStyle}>{events[i][1]}</div>
                        </td>);
            } else {
                return (<td key={i} className='curr-month' id={'m.' + thisDayMs}>
                            <div className='date'>{thisDay}</div>
                            <div style={evSomeDaysStyle}>{events[i][0]}</div>
                            <div style={evOneDayStyle}>{events[i][1]}</div>
                        </td>);
            }
        }, this);
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

        for (let n = 1; currDay <= this.props.dateLast; currDay = currDay + 7 * MS_IN_DAY, n++) {
            let eventsWeek = events.filter(function(value) {
                return new Date(value.start_date).getTime() >= currDay
                       && new Date(value.start_date).getTime() < currDay + 7 * MS_IN_DAY
                       || new Date(value.end_date).getTime() >= currDay
                       && new Date(value.end_date).getTime() < currDay + 7 * MS_IN_DAY
                       || new Date(value.start_date).getTime() < currDay
                       && new Date(value.end_date).getTime() >= currDay + 7 * MS_IN_DAY;
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
                <table className='title-date'>
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
