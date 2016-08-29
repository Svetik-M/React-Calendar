'use strict'

import React from 'react';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];
const MS_IN_DAY = 86400000;


function createWeek(firstDay, dateFirst, month, msInDay, selDay, period) {
    var allDays = Array.from({length: 7}),
        today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        selPeriod = '';

    if (period === 'month' && selDay.getMonth() === month
        || period === 'week' && firstDay <= selDay.getTime() && selDay.getTime() <= firstDay + 6*msInDay) {
        selPeriod = ' selectedPeriod';
    }
    allDays = allDays.map(function(v,i) {
        var date = new Date(firstDay + i*msInDay),
            thisDay = date.getDate(),
            thisDayMs = date.getTime(),
            select = selPeriod;

        if (period === 'day' &&  thisDayMs === selDay.getTime()) {
            select = ' selectedPeriod';
        }

        if (date.getMonth() !== dateFirst.getMonth()) {
            return <td key={i} className={'other-month' + select} id={thisDayMs}>{thisDay}</td>;
        } else  if (thisDayMs === today.getTime()) {
            return <td key={i} className={'curr-month today' + select} id={thisDayMs}>{thisDay}</td>;
        } else {
            return <td key={i} className={'curr-month' + select} id={thisDayMs}>{thisDay}</td>;
        }
    });
    return  (
        <tr>
            {allDays}
        </tr>
    );
}

function createMonth(msInDay, Week, selDay, day, period) {
    var month = day.getMonth(),
        year = day.getFullYear(),
        lastDayOfMonth = new Date(year ,month+1, 0).getDate(),
        dateLast = new Date(year, month, lastDayOfMonth),
        dateFirst = new Date(year, month, 1),
        DOW_first = dateFirst.getDay(),
        currDay = dateFirst.getTime() - DOW_first * MS_IN_DAY,
        weeks = [];
    for (let n = 1; currDay <= dateLast.getTime(); currDay = currDay + 7*msInDay, n++) {
        weeks.push(
            <Week key = {n} sel_day={selDay} date={currDay} month={month} year={year} period={period} />
        );
    }
    return (
        <tbody className='monthTable'>
            {weeks}
        </tbody>
    );
}


var Week = React.createClass({
    render: function() {
        var firstDay = this.props.date,
            dateFirst = new Date(this.props.year, this.props.month, 1);
        return createWeek(firstDay, dateFirst, this.props.month, MS_IN_DAY, this.props.sel_day, this.props.period);
    }
});


var Month = React.createClass({
    render: function() {
        var period = this.props.period || '',
            selDay = this.props.sel_day || '';
        return createMonth(MS_IN_DAY, Week, selDay, this.props.day, period);
    }
});


var CalendarWidget = React.createClass({
    getInitialState: function() {
        return {
            selDay: this.props.day,
            date: this.props.day,
            period: this.props.period
        }
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            selDay: nextProps.day,
            date: nextProps.day,
            period: nextProps.period
        })
    },

    getPrevMonth: function() {
        var year = this.state.date.getFullYear(),
            month = this.state.date.getMonth(),
            day = this.state.date.getDate();
        this.setState({date: new Date(year, month-1, day)});
    },

    getNextMonth: function() {
        var year = this.state.date.getFullYear(),
            month = this.state.date.getMonth(),
            day = this.state.date.getDate();
        this.setState({date: new Date(year, month+1, day)})
    },

    render: function() {
        var date = this.state.date,
            month = date.getMonth(),
            year = date.getFullYear();

        return (
            <div className='nav-date'>
                <div className='nav-title'>
                    <div onClick={this.getPrevMonth}>
                        <i className='fa fa-chevron-circle-left' aria-hidden='true' />
                    </div>
                    <div id='curr-month' data-month={month} data-year={year}>
                        {MONTH_NAMES[month] + ' ' + year}
                    </div>
                    <div onClick={this.getNextMonth}>
                        <i className='fa fa-chevron-circle-right' aria-hidden='true' />
                    </div>
                </div>
                <table className='calendar'>
                    <thead>
                        <tr>
                            <td>Sun</td>
                            <td>Mon</td>
                            <td>Tue</td>
                            <td>Wed</td>
                            <td>Thu</td>
                            <td>Fri</td>
                            <td>Sat</td>
                        </tr>
                    </thead>
                    <Month sel_day={this.state.selDay} day={date} period={this.state.period}/>
                </table>
            </div>
        );
    }
});


export {createWeek, createMonth, CalendarWidget};
