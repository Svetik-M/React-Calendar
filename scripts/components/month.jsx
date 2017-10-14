'use strict'


import React from 'react';

import Event from './event.jsx';
import CreateEvent from './create-event.jsx';

import {sortWeekEventsByDays, sortWeekEventsByDuration} from '../get-events.js';
import {getBlockTopShift, getStartDateStrAndCoefWidth} from '../viewing-options.js';


const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      MS_IN_DAY = 86400000;


const Week = React.createClass({
    getInitialState: function() {
        return {
            events: new Array(7)
        }
    },

    componentWillReceiveProps: function(nextProps) {
        let arrOfEvents = sortWeekEventsByDays(nextProps.events, nextProps.firstDateOfWeekMS);
        arrOfEvents =  sortWeekEventsByDuration(arrOfEvents, nextProps.firstDateOfWeekMS);

        let arrTopEl = getBlockTopShift(arrOfEvents, nextProps.firstDateOfWeekMS);

        this.setState({
            events: arrOfEvents,
            topEl: arrTopEl
        });
    },

    componentWillMount: function() {
        let arrOfEvents = sortWeekEventsByDays(this.props.events, this.props.firstDateOfWeekMS);
        arrOfEvents = sortWeekEventsByDuration(arrOfEvents, this.props.firstDateOfWeekMS);

        let arrTopEl = getBlockTopShift(arrOfEvents, this.props.firstDateOfWeekMS);

        this.setState({
            events: arrOfEvents,
            topEl: arrTopEl
        });
    },

    render: function() {
        let firstDayOfWeekMS = this.props.firstDateOfWeekMS,
            month = this.props.selDate.getMonth(),
            firstDateOfMonth = new Date(this.props.selDate.getFullYear(), month, 1),
            lastDateOfMonth = new Date(this.props.selDate.getFullYear(), month + 1, 0),
            today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            quantityWeeks = Math.ceil((lastDateOfMonth.getDate() - 7 + firstDateOfMonth.getDay()) / 7) + 1,
            events = this.state.events,
            tableRow = [];

        events = events.map(function(value, index) {
            let dateMidnightMS = firstDayOfWeekMS + index * MS_IN_DAY;

            let arrDayEvents = value.map(function(val) {
                if (val === undefined) {
                    return val;
                } else {
                    let arrEvents = val.map(function(item) {
                        let params = getStartDateStrAndCoefWidth(item, index, dateMidnightMS);

                        if (params === undefined) return undefined;

                        return <Event key={item.id} events={this.props.events} currEvent={item}
                            startDateStr={params.startDateStr} period='month' dateMidnightMS={dateMidnightMS}
                            coefWidth={params.coefWidth} />;
                    }, this);

                    return arrEvents;
                }
            }, this);

            return arrDayEvents;

        }, this);

        for (let i = 0; i < 7; i++) {
            let date = new Date(firstDayOfWeekMS + i * MS_IN_DAY),
                dateOfMonth = date.getDate(),
                dateMS = date.getTime(),
                Firefox = navigator.userAgent.indexOf("Firefox") >= 0,
                coef = Firefox ? 2.5 : 2,
                coefDivHeight = this.state.topEl[i] + events[i][0].filter(v => v !== undefined).length,

                tdStyle = { height: 'calc((100vh - ' + 5.3 + 'rem) / ' + quantityWeeks + ')',
                            minHeight: 5 + 'rem' },

                evOneDayStyle = {
                    height: 'calc(100% - (' + (coefDivHeight * 1.2 + 1.1) + 'rem + '
                            + (coefDivHeight + coef)  + 'px) - ' + 1 + 'px)'
                },

                evSomeDaysStyle;

            if (events[i][0].length > 0 && events[i][0][0] === undefined) {
                evSomeDaysStyle = {top: 'calc(' + this.state.topEl[i] + ' * ('
                                    + 1.2 + 'rem + ' + coef + 'px) + ' + 1 + 'px)'};
                evOneDayStyle.top = evSomeDaysStyle.top;
            }

            if (date.getMonth() !== month) {
                tableRow.push(<td key={i} className='other-month' data-date={dateMS} style={tdStyle}>
                                  <div className='date'>{dateOfMonth}</div>
                                  <div style={evSomeDaysStyle}>{events[i][0]}</div>
                                  <div style={evOneDayStyle}>{events[i][1]}</div>
                              </td>);
            } else  if (dateMS === today.getTime()) {
                tableRow.push(<td key={i} className='curr-month today' data-date={dateMS} style={tdStyle}>
                                  <div className='date'>{dateOfMonth}</div>
                                  <div style={evSomeDaysStyle}>{events[i][0]}</div>
                                  <div style={evOneDayStyle}>{events[i][1]}</div>
                              </td>);
            } else {
                tableRow.push(<td key={i} className='curr-month' data-date={dateMS} style={tdStyle}>
                                  <div className='date'>{dateOfMonth}</div>
                                  <div style={evSomeDaysStyle}>{events[i][0]}</div>
                                  <div style={evOneDayStyle}>{events[i][1]}</div>
                              </td>);
            }
        }

        return  (
            <tr>
                {tableRow}
            </tr>
        );
    }
});


const Month = React.createClass({
    render: function() {
        let firstDateOfWeekMS = this.props.startDateMS,
            events = this.props.events,
            weeks = [];

        for (let n = 1; firstDateOfWeekMS <= this.props.lastDateOfMonthMS;
            firstDateOfWeekMS = firstDateOfWeekMS + 7 * MS_IN_DAY, n++) {

            let eventsWeek = events.filter(function(value) {
                return new Date(value.start_date).getTime() >= firstDateOfWeekMS
                       && new Date(value.start_date).getTime() < firstDateOfWeekMS + 7 * MS_IN_DAY
                       || new Date(value.end_date).getTime() >= firstDateOfWeekMS
                       && new Date(value.end_date).getTime() < firstDateOfWeekMS + 7 * MS_IN_DAY
                       || new Date(value.start_date).getTime() < firstDateOfWeekMS
                       && new Date(value.end_date).getTime() >= firstDateOfWeekMS + 7 * MS_IN_DAY;
            });
            weeks.push(
                <Week key = {n} firstDateOfWeekMS={firstDateOfWeekMS} selDate={this.props.selDate}
                    events={eventsWeek} scope={this.props.scope} />
            );
        }

        return (
            <tbody className='month-table'>
                {weeks}
            </tbody>
        );
    }
});


const IventsOfMonth = React.createClass({
    render: function() {
        let tableTitle = [];

        for (let i = 0; i < 7; i++) {
            tableTitle.push(<td key={i} className='events-group'>
                       {DAYS_OF_WEEK[i]}
                   </td>);
        }

        return (
            <div className='events-block all-month'>
                <table className='title-date'>
                    <tbody>
                        <tr>
                            {tableTitle}
                        </tr>
                    </tbody>
                </table>
                <table className='events-list month'>
                    <Month selDate={this.props.selDate} startDateMS={this.props.startDateMS}
                        lastDateOfMonthMS={this.props.lastDateOfMonthMS} events={this.props.events}
                        scope={this.props.scope} />
                </table>
            </div>
        )
    }
});


export default IventsOfMonth;
