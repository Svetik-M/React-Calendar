'use strict'

import React from 'react';
import ReactDOM from 'react-dom';


function createWeek(firstDay, dateFirst, msInDay) {
    var days = Array.from({length: 7}),
        today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    days = days.map(function(v,i) {
        var day = new Date(firstDay + i*msInDay);
        if (day.getMonth() !== dateFirst.getMonth()) {
            return <td key={i} className='other-month' id={day.getTime()}>{day.getDate()}</td>;
        } else  if (day.getTime() === today.getTime()) {
            return <td key={i} className='curr-month today' id={day.getTime()}>{day.getDate()}</td>;
        } else {
            return <td key={i} className='curr-month' id={day.getTime()}>{day.getDate()}</td>;
        }
    });
    return  (
        <tr>
            {days}
        </tr>
    );
}

function createMonth(currDay, dateLast, msInDay, Week) {
    var weeks = [];
    for (let n = 1; currDay <= dateLast.getTime(); currDay = currDay + 7*msInDay, n++) {
        weeks.push(<Week key = {n} date={currDay} />)
    }
    return (
        <tbody className='monthTable'>
            {weeks}
        </tbody>
    );
}


//Render Calendar Widget

function renderCalendarWidget(date) {
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
    const MS_IN_DAY = 86400000;

    var month = date.getMonth(),
        year = date.getFullYear(),
        lastDayOfMonth = new Date(year ,month+1, 0).getDate(),
        dateLast = new Date(year, month, lastDayOfMonth),
        dateFirst = new Date(year, month, 1),
        DOW_last = dateLast.getDay(),
        DOW_first = dateFirst.getDay(),
        currDay = dateFirst.getTime() - DOW_first * MS_IN_DAY;

    var MonthNav = React.createClass({
        render: function() {
            return (<div id='month' data-month={month} data-year={year}>
                        {MONTH_NAMES[month] + ' ' + year}
                    </div>);
        }
    });

    ReactDOM.render(
        <MonthNav />,
        document.getElementById('curr-month')
    );

    var Week = React.createClass({
        render: function() {
            var firstDay = this.props.date;
            return createWeek(firstDay, dateFirst, MS_IN_DAY);
        }
    });

    var Month = React.createClass({
        render: function() {
            return createMonth(currDay, dateLast, MS_IN_DAY, Week);
        }
    });

    var Calendar = React.createClass({
        render: function() {
            return (
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
                    <Month />
                </table>
            );
        }
    });

    ReactDOM.render(
        <Calendar />,
        document.getElementById('nav-calendar')
    );

}


//Render Selected period

function getSelectedPeriod(period) {
    var Period = React.createClass({
        render: function(){
            return <div>{period}</div>
        }
    });

    ReactDOM.render(
        <Period />,
        document.getElementById('selected-period')
    );
}


// exports.createWeek = createWeek;
// exports.createMonth = createMonth;
// exports.renderCalendarWidget = renderCalendarWidget;
// exports.getSelectedPeriod = getSelectedPeriod;

//module.exports = renderCalendarWidget;

export {createWeek, createMonth, renderCalendarWidget, getSelectedPeriod};
