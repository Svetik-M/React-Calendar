'use strict'


import React from 'react';

import Event from './event.jsx';

import {sortDayEventsByHour, sortEvForCountMaxLength} from '../get-events.js';


const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000;


const IventsOfDay = React.createClass({
    getInitialState: function() {
        return {
            events: new Array(49)
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
        let selDate = this.props.selDate,
            dateMidnightMS = selDate.getTime(),
            DOW_selDate = DAYS_OF_WEEK[selDate.getDay()],
            events = this.state.events,
            tableRows = [],
            timeStr;

        let tableTitle = (<td className='events-group'>
                         {DOW_selDate + ' ' + selDate.getDate() + '/' + (+selDate.getMonth() + 1)}
                     </td>);

        events = events.map(function(value){
            if (value === undefined) {
                return value;
            } else {
                let arr = value.map(function(item) {
                    let startDateMS = item.start_date,
                        startDateStr;

                    if (startDateMS < dateMidnightMS) {
                        startDateStr = '';
                    } else {
                        startDateStr = new Date(startDateMS).toLocaleString('en-US',
                                {hour: '2-digit', minute: '2-digit'}).toLowerCase().replace(' ', '');
                    }

                    return <Event key={item.id} events={this.props.events} currEvent={item}
                        startDateStr={startDateStr} period='day' dateMidnightMS={dateMidnightMS} />;
                }, this);

                return arr;
            }
        }, this);

        for (let i = 0; i < 25; i++) {
            if (i === 0) {
                tableRows.push(
                    <tr key={i}>
                        <td className='time all-day'>All Day</td>
                        <td className='events-group all-day'>
                            {events[0]}
                        </td>
                    </tr>
                );

            } else {

                if (i === 1) timeStr = '12am';
                else if (i < 13) timeStr = (i - 1) + 'am';
                else if (i === 13) timeStr = '12pm';
                else if (i > 13) timeStr = (i - 13) + 'pm';

                let divStyle = {width: 'calc(95% - ' + 16 * this.state.maxLen + 'px)'}

                tableRows.push(
                    <tr key={i}>
                        <td className='time'>{timeStr}</td>
                        <td className='events-group'>
                            <div className='half' data-date={dateMidnightMS + i * MS_IN_HOUR}>
                                <div style={divStyle}>
                                    {events[2 * i - 1]}
                                </div>
                            </div>
                            <div className='half' data-date={dateMidnightMS + i * MS_IN_HOUR + MS_IN_HOUR/2}>
                                <div style={divStyle}>
                                    {events[2 * i]}
                                </div>
                            </div>
                        </td>
                    </tr>
                );
            }
        }

        return (
            <div className='events-block'>
                <table className='title-date'>
                    <tbody>
                        <tr>
                            <td className='time'></td>
                            {tableTitle}
                        </tr>
                    </tbody>
                </table>
                <table className='events-list day'>
                {/*}<thead>
                    <tr>
                        <td className='time'></td>
                        {tableTitle}
                    </tr>
                </thead>*/}
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        );
    }
});


function getNewState(props) {
    let eventsByHours = sortDayEventsByHour(props.events, props.selDate.getTime()),
        arrOfEvents = sortEvForCountMaxLength(props.events, props.selDate.getTime()),
        arrLen = arrOfEvents.map(val => val.length),
        maxLen =  Math.max.apply(null, arrLen);

        return {events: eventsByHours, maxLen: maxLen};
}


export default IventsOfDay;
