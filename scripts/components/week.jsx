'use strict'


import React from 'react';

import Event from './event.jsx';
import {sortWeekEventsByDays, sortDayEventsByHour, sortEvForCountMaxLength} from '../get-events.js';


const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;


const IventsOfWeek = React.createClass({
    getInitialState: function() {
        return {
            events: Array.from({length: 7})
        }
    },

    componentWillReceiveProps: function(nextProps) {
        let state = getNewState(nextProps);
        this.setState(state);
    },

    componentWillMount: function() {
        let state = getNewState(this.props);
        this.setState(state);
    },

    render: function() {
        let date = this.props.day,
            DOW_date = date.getDay(),
            firstDay = date.getTime() - DOW_date*MS_IN_DAY,
            titleTable = Array.from({length:7}),
            events = this.state.events,
            timeRows = Array.from({length:25}),
            timeStr;

        titleTable = titleTable.map(function(v,i) {
            let day = new Date(firstDay + i * MS_IN_DAY).getDate(),
                month = parseInt(new Date(firstDay + i * MS_IN_DAY).getMonth()) + 1,
                year = new Date(firstDay + i * MS_IN_DAY).getFullYear();

            return (<td key={i} className='events-group'>
                        {DAYS_OF_WEEK[i] +' '+ day +'/'+ month}
                    </td>);
        });

        events = events.map(function(value, index){
            let midnight = firstDay + index * MS_IN_DAY;

            let arrDay = value.map(function(val) {
                if (val === undefined) {
                    return val;

                } else {
                    let arrTime = val.map(function(item) {
                        let startDate = item.start_date,
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
                            period='week' midnight={midnight} coefWidth={coefWidth} />;
                    }, this);

                    return arrTime;
                }
            }, this);

            return arrDay;

        }, this);

        timeRows = timeRows.map(function(value, index) {
            let eventsDOW  = Array.from({length:7}),
                d = new Date(),
                today = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

            if (index === 1) timeStr = '12am';
            else if (index < 13) timeStr = (index - 1) + 'am';
            else if (index === 13) timeStr = '12pm';
            else if (index > 13) timeStr = (index - 13) + 'pm';


            eventsDOW = eventsDOW.map(function(v, i) {
                let bool = (firstDay + i * MS_IN_DAY === today),
                    date = firstDay + i * MS_IN_DAY;

                if (index === 0) {
                    let tdStyle = {
                        height: 'calc(' + (events[i][0].length * 1.2) + 'rem + ' + (events[i][0].length + 6)  + 'px)'
                    };
                    return (
                        <td key={i} className={bool ? 'events-group curr-day all-day' : 'events-group all-day'}
                            style={tdStyle}>
                            {events[i][0]}
                        </td>
                    );
                }

                let divStyle = {width: 'calc(100% - ' + 7 * (this.state.maxLen[i] - 1) + 'px)'};

                return (
                    <td key={i} className={bool ? 'events-group curr-day' : 'events-group'}>
                        <div key={i+.0} className='half'
                            id={firstDay + i * MS_IN_DAY + index * MS_IN_HOUR}>
                            <div style={divStyle}>
                                {events[i][2 * index - 1]}
                            </div>
                        </div>
                        <div key={i+.1} className='half'
                            id={firstDay + i * MS_IN_DAY + i * MS_IN_HOUR + MS_IN_HOUR/2}>
                            <div style={divStyle}>
                                {events[i][2 * index]}
                            </div>
                        </div>
                    </td>
                );
            }, this);

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
        }, this);

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


function getNewState(props) {
    let firstDay = props.day.getTime() - props.day.getDay() * MS_IN_DAY,
        arr = sortWeekEventsByDays(props.events, firstDay),
        arrOfEvents = arr.map(function(val, ind) {
            let midnight = firstDay + ind * MS_IN_DAY;
            return sortDayEventsByHour(val, midnight);
        }),

        arrOfEv = arr.map(function(val, ind) {
            let midnight = firstDay + ind * MS_IN_DAY;
            return sortEvForCountMaxLength(val, midnight);
        }),

        arrLength = arrOfEv.map(val => {
            let arrLen = val.map(v => v.length);
            return Math.max.apply(null, arrLen);
        });

    return {events: arrOfEvents, maxLen: arrLength};
}


export default IventsOfWeek;
