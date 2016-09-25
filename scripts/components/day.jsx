'use strict'


import React from 'react';

import Event from './event.jsx';

import getEvents from '../get-events.js';


const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000;


const IventsOfDay = React.createClass({
    getInitialState: function() {
        return {
            events: Array.from({length: 49})
        }
    },

    componentWillReceiveProps: function(nextProps) {
        let state = getNewState(nextProps)
        this.setState(state);
    },

    componentWillMount: function() {
        let state = getNewState(this.props)
        this.setState(state);
    },

    render: function() {
        let date = this.props.day,
            midnight = date.getTime(),
            DOW_date = DAYS_OF_WEEK[date.getDay()],
            titleTable = (<td className='events-group'>
                             {DOW_date +' '+ date.getDate() +'/'+ (+date.getMonth()+1)}
                         </td>),
            events = this.state.events,
            rows = Array.from({length:25}),
            timeStr;

        events = events.map(function(value){
            if (value === undefined) {
                return value;
            } else {
                let arr = value.map(function(item) {
                    let startDate = item.start_date,
                        endDate = item.end_date,
                        start;

                    if (startDate < midnight) {
                        start = '';
                    } else {
                        start = new Date(startDate).toLocaleString('en-US',
                                {hour: '2-digit', minute: '2-digit'}).toLowerCase().replace(' ', '');
                    }

                    return <Event key={item.id} events={this.props.events} currEvent={item} start={start}
                        period='day' midnight={midnight} />;
                }, this);

                return arr;
            }
        }, this);

        rows = rows.map(function(v, i) {
            if (i === 0) {
                return (
                    <tr key={i}>
                        <td className='time all-day'>All Day</td>
                        <td className='events-group all-day'>
                            {events[0]}
                        </td>
                    </tr>
                );
            }

            if (i === 1) timeStr = '12am';
            else if (i < 13) timeStr = (i - 1) + 'am';
            else if (i === 13) timeStr = '12pm';
            else if (i > 13) timeStr = (i - 13) + 'pm';

            let divStyle = {width: 'calc(95% - ' + 16 * this.state.maxLen + 'px)'}

            return (
                <tr key={i}>
                    <td className='time'>{timeStr}</td>
                    <td className='events-group'>
                        <div className='half' id={midnight + i * MS_IN_HOUR}>
                            <div style={divStyle}>
                                {events[2 * i - 1]}
                            </div>
                        </div>
                        <div className='half' id={midnight + i * MS_IN_HOUR + MS_IN_HOUR/2}>
                            <div style={divStyle}>
                                {events[2 * i]}
                            </div>
                        </div>
                    </td>
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
                <table className='events-list day'>
                <thead>
                    <tr>
                        <td className='time'></td>
                        {titleTable}
                    </tr>
                </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
});


function getNewState(props) {
    let arrOfEvents = getEvents.sortDayEventsByHour(props.events, props.day.getTime()),
        arrOfEv = getEvents.sortEvForCountMaxLength(props.events, props.day.getTime()),
        arrLen = arrOfEv.map(val => val.length),
        maxLen =  Math.max.apply(null, arrLen);
        return {events: arrOfEvents, maxLen: maxLen};
}


export default IventsOfDay;
