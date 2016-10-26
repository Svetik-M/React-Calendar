'use strict'


import React from 'react';

import Event from './event.jsx';
import {sortWeekEventsByDays, sortDayEventsByHour, sortEvForCountMaxLength} from '../get-events.js';
import {getStartDateStrAndCoefWidth} from '../viewing-options.js';


const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;


const IventsOfWeek = React.createClass({
    getInitialState: function() {
        return {
            events: new Array(7)
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
        let selDate = this.props.selDate,
            DOW_selDate = selDate.getDay(),
            firstDateOfWeekMS = selDate.getTime() - DOW_selDate * MS_IN_DAY,
            events = this.state.events,
            tableTitle = [],
            tableRows = [],
            timeStr;

        for(let i = 0; i < 7; i++) {
            let day = new Date(firstDateOfWeekMS + i * MS_IN_DAY).getDate(),
                month = +(new Date(firstDateOfWeekMS + i * MS_IN_DAY).getMonth()) + 1;

            tableTitle.push(<td key={i} className='events-group'>
                            {DAYS_OF_WEEK[i] + ' ' + day + '/' + month}
                        </td>);
        }

        events = events.map(function(value, index){
            let dateMidnightMS = firstDateOfWeekMS + index * MS_IN_DAY;

            let arrDayEvents = value.map(function(val) {
                if (val === undefined) {
                    return val;

                } else {
                    let arrTimeEvents = val.map(function(item) {
                        let params = getStartDateStrAndCoefWidth(item, index, dateMidnightMS);

                        if (params === undefined) return undefined;

                        return <Event key={item.id} events={this.props.events} currEvent={item}
                            startDateStr={params.startDateStr} period='week' dateMidnightMS={dateMidnightMS}
                            coefWidth={params.coefWidth} />;
                    }, this);

                    return arrTimeEvents;
                }
            }, this);

            return arrDayEvents;

        }, this);

        for (let index = 0; index < 25; index++) {
            let eventsByDOW = [],
                d = new Date(),
                todayMS = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

            if (index === 1) timeStr = '12am';
            else if (index < 13) timeStr = (index - 1) + 'am';
            else if (index === 13) timeStr = '12pm';
            else if (index > 13) timeStr = (index - 13) + 'pm';

            for (let i = 0; i < 7; i++) {
                let bool = firstDateOfWeekMS + i * MS_IN_DAY === todayMS;

                if (index === 0) {
                    let tdStyle = {
                        height: 'calc(' + (events[i][0].length * 20) + 'px + '
                                        + (events[i][0].length * 2 + 6)  + 'px)'
                    };

                    eventsByDOW.push(
                        <td key={i} className={bool ? 'events-group today all-day' : 'events-group all-day'}
                            style={tdStyle}>
                            {events[i][0]}
                        </td>
                    );
                } else {
                    let divStyle = {width: 'calc(100% - ' + 7 * (this.state.maxLen[i] - 1) + 'px)'};

                    eventsByDOW.push (
                        <td key={i} className={bool ? 'events-group today' : 'events-group'}>
                            <div key={i + .0} className='half'
                                data-date={firstDateOfWeekMS + i * MS_IN_DAY + index * MS_IN_HOUR}>
                                <div style={divStyle}>
                                    {events[i][2 * index - 1]}
                                </div>
                            </div>
                            <div key={i + .1} className='half'
                                data-date={firstDateOfWeekMS + i * MS_IN_DAY + i * MS_IN_HOUR + MS_IN_HOUR/2}>
                                <div style={divStyle}>
                                    {events[i][2 * index]}
                                </div>
                            </div>
                        </td>
                    );
                }
            }

            if (index === 0) {
                tableRows.push(
                    <tr key={index}>
                        <td className='time all-day'>All Day</td>
                        {eventsByDOW}
                    </tr>
                );
            } else {
                tableRows.push(
                    <tr key={index}>
                        <td className='time'>{timeStr}</td>
                        {eventsByDOW}
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
                <table className='events-list week'>
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
        )
    }
});


function getNewState(props) {
    let firstDateOfWeekMS = props.selDate.getTime() - props.selDate.getDay() * MS_IN_DAY,
        eventsByDays = sortWeekEventsByDays(props.events, firstDateOfWeekMS),

        eventsByHours = eventsByDays.map(function(val, ind) {
            let dateMidnightMS = firstDateOfWeekMS + ind * MS_IN_DAY;
            return sortDayEventsByHour(val, dateMidnightMS);
        }),

        arrOfEvents = eventsByDays.map(function(val, ind) {
            let dateMidnightMS = firstDateOfWeekMS + ind * MS_IN_DAY;
            return sortEvForCountMaxLength(val, dateMidnightMS);
        }),

        arrMaxLen = arrOfEvents.map(val => {
            let arrLen = val.map(v => v.length);
            return Math.max.apply(null, arrLen);
        });

    return {events: eventsByHours, maxLen: arrMaxLen};
}


export default IventsOfWeek;
