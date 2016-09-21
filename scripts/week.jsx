'use strict'

import React from 'react';
import {Event} from './event.jsx';
import getEvents from './get-events.js';


const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;


var IventsOfWeek = React.createClass({
    getInitialState: function() {
        return {
            events: Array.from({length: 7})
        }
    },

    componentWillReceiveProps: function(nextProps) {
        var firstDay = nextProps.day.getTime() - nextProps.day.getDay() * MS_IN_DAY,
            arr = getEvents.sortWeekEventsByDays(nextProps.events, firstDay),
            arrOfEvents = arr.map(function(val, ind) {
                var midnight = firstDay + ind * MS_IN_DAY;
                return getEvents.sortDayEventsByHour(val, midnight);
            });
        this.setState({events: arrOfEvents});
    },

    componentWillMount: function() {
        var firstDay = this.props.day.getTime() - this.props.day.getDay() * MS_IN_DAY,
            arr = getEvents.sortWeekEventsByDays(this.props.events, firstDay),
            arrOfEvents = arr.map(function(val, ind) {
                var midnight = firstDay + ind * MS_IN_DAY;
                return getEvents.sortDayEventsByHour(val, midnight);
            });
        this.setState({events: arrOfEvents});
    },

    render: function() {
        var date = this.props.day,
            DOW_date = date.getDay(),
            firstDay = date.getTime() - DOW_date*MS_IN_DAY,
            titleTable = Array.from({length:7}),
            events = this.state.events,
            timeRows = Array.from({length:24}),
            timeStr;

        titleTable = titleTable.map(function(v,i) {
            var day = new Date(firstDay + i * MS_IN_DAY).getDate(),
                month = parseInt(new Date(firstDay + i * MS_IN_DAY).getMonth()) + 1,
                year = new Date(firstDay + i * MS_IN_DAY).getFullYear();

            return (<td key={i} className='events-group'>
                        {DAYS_OF_WEEK[i] +' '+ day +'/'+ month}
                    </td>);
        });

        events = events.map(function(value, index){
            var midnight = firstDay + index * MS_IN_DAY;

            var arrDay = value.map(function(val) {
                if (val === undefined) {
                    return val;

                } else {
                    let arrTime = val.map(function(item) {
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

                        return <Event key={item.id} events={this.props.events} currEvent={item} start={start}
                            scope={this.props.scope} midnight={midnight} coefWidth={coefWidth} DOW={index} />;
                    }, this);

                    return arrTime;
                }
            }, this);

            return arrDay;

        }, this);

        timeRows = timeRows.map(function(value, index) {
            var eventsDOW  = Array.from({length:7}),
                d = new Date(),
                today = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

            if (index === 1) timeStr = '12am';
            else if (index < 13) timeStr = (index - 1) + 'am';
            else if (index === 13) timeStr = '12pm';
            else if (index > 13) timeStr = (index - 13) + 'pm';


            eventsDOW = eventsDOW.map(function(v, i) {
                var bool = (firstDay + i * MS_IN_DAY === today),
                    date = firstDay + i * MS_IN_DAY;

                if (index === 0) {
                    let tdStyle = {
                        height: 'calc(' + (events[i][0].length * 1.2) + 'rem + ' + (events[i][0].length + 6)  + 'px)'
                    };
                    return (
                        <td key={i} className='events-group all-day' style={tdStyle}>
                            {events[i][0]}
                        </td>
                    );
                }

                return (
                    <td key={i} className={bool ? 'events-group curr-day' : 'events-group'}>
                        <div key={i+.0} className='half'
                            id={firstDay + i * MS_IN_DAY + index * MS_IN_HOUR}>
                            <div>
                                {events[i][2 * index - 1]}
                            </div>
                        </div>
                        <div key={i+.1} className='half'
                            id={firstDay + i * MS_IN_DAY + i * MS_IN_HOUR + MS_IN_HOUR/2}>
                            <div>
                                {events[i][2 * index]}
                            </div>
                        </div>
                    </td>
                );
            });

            if (index === 0) {
                return (
                    <tr key={index}>
                        <td className='time all-day'>All Day</td>
                        {eventsDOW}
                    </tr>
                );
            }


            return (
                <tr key={index}>
                    <td className='time'>{timeStr}</td>
                    {eventsDOW}
                </tr>
            );
        });

        return (
            <div className='events-block'>
                <table className='title-date'>
                    <tbody>
                        <tr>
                            <td className='time'></td>
                            {titleTable}
                        </tr>
                    </tbody>
                </table>
                <table className='events-list week'>
                    <thead>
                        <tr>
                            <td className='time'></td>
                            {titleTable}
                        </tr>
                    </thead>
                    <tbody>
                        {timeRows}
                    </tbody>
                </table>
            </div>
        )
    }
});


export {IventsOfWeek};
