'use strict'

import React from 'react';
//import {createWeek} from './calendar-widget.jsx';
import {createMonth} from './calendar-widget.jsx';
import {Event} from './event.jsx';
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
            events: Array.from({length:7}),
            id: ''
        }
    },

    componentWillReceiveProps: function(nextProps) {
        var timeZone = new Date(nextProps.date).getTimezoneOffset()*60*60*100,
            start = nextProps.date - timeZone,
            end = start + 6 * MS_IN_DAY;
        requests.getEvents.call(this, start, end);
    },

    componentWillMount: function() {
        var timeZone = new Date(this.props.date).getTimezoneOffset()*60*60*100,
            start = this.props.date - timeZone,
            end = start + 6 * MS_IN_DAY;
        requests.getEvents.call(this, start, end);
    },

    getArrOfEvents: function(res) {
        var arrOfEvents = Array.from({length:7}),
            date = this.props.date;
        for (let i = 0; i < 7; i++) {
            let arr = res.filter(function(value) {
                var start = new Date(value.start_date).getTime(),
                    end = new Date(value.end_date).getTime(),
                    day = new Date(date + i * MS_IN_DAY).getTime();
                return start === day ||
                       end === day ||
                       start < day && end > day;
            });
            arrOfEvents[i] = arr;
        };
        this.setState({events: arrOfEvents});
    },

    updateEvents: function() {
        var timeZone = new Date(this.props.date).getTimezoneOffset()*60*60*100,
            start = this.props.date - timeZone,
            end = start + 6 * MS_IN_DAY;
        requests.getEvents.call(this, start, end);
    },

    render: function() {
        var firstDay = this.props.date,
            dateFirst = new Date(this.props.year, this.props.month, 1),
            month = this.props.month,
            events = this.state.events,
            allDays = Array.from({length: 7}),
            today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            call = this;

        events = events.map(function(value, index) {
            if (value === undefined) {
                return value;
            } else {
                let arr = value.map(function(item) {
                    var start = item.start_time.slice(0, -3);
                    if (new Date(item.start_date).getTime() < (firstDay + index * MS_IN_DAY)) start = '00:00';
                    return <Event key={item.id} event={item} start={start} scope={call} />;
                });

                return arr;
            }
        });

        allDays = allDays.map(function(v, i) {
            var date = new Date(firstDay + i*MS_IN_DAY),
                thisDay = date.getDate(),
                thisDayMs = date.getTime();

            if (date.getMonth() !== dateFirst.getMonth()) {
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
        var period = this.props.period || '',
            selDay = this.props.sel_day || '';
        return createMonth(MS_IN_DAY, Week, selDay, this.props.day, period);
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
                <table className='event-list month'>
                    <thead>
                        <tr>
                            {titleTable}
                        </tr>
                    </thead>
                    <Month day={this.props.day} />
                </table>
            </div>
        )
    }
});


export {IventsOfMonth};
