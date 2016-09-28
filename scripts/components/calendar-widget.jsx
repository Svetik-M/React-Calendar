'use strict'


import React from 'react';


const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'],
      MS_IN_DAY = 86400000;


const Week = React.createClass({
    render: function() {
        let firstDateOfWeekMS = this.props.firstDateOfWeekMS,
            selDate = this.props.selDate,
            period = this.props.period,
            daysArr = Array.from({length: 7}),
            today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            selPeriod = '';

        if (period === 'month'
            && selDate.getMonth() === this.props.viewMonth
            || period === 'week'
            && firstDateOfWeekMS <= selDate.getTime()
            && selDate.getTime() <= firstDateOfWeekMS + 6*MS_IN_DAY) {

            selPeriod = ' selectedPeriod';
        }

        daysArr = daysArr.map(function(v,i) {
            let date = new Date(firstDateOfWeekMS + i*MS_IN_DAY),
                dayOfMonth = date.getDate(),
                dayOfMonthMs = date.getTime(),
                select = selPeriod;

            if (period === 'day' &&  dayOfMonthMs === selDate.getTime()) {
                select = ' selectedPeriod';
            }

            if (date.getMonth() !== this.props.viewMonth) {
                return (<td key={i} className={'other-month' + select} id={dayOfMonthMs}>
                            {dayOfMonth}
                        </td>);
            } else  if (dayOfMonthMs === today.getTime()) {
                return (<td key={i} className={'curr-month today' + select} id={dayOfMonthMs}>
                            {dayOfMonth}
                        </td>);
            } else {
                return (<td key={i} className={'curr-month' + select} id={dayOfMonthMs}>
                            {dayOfMonth}
                        </td>);
            }
        }, this);

        return  (
            <tr>
                {daysArr}
            </tr>
        );
    }
});


const Month = React.createClass({
    render: function() {
        let selDate = this.props.selDate || '',
            period = this.props.period || '',
            viewMonth = this.props.viewDate.getMonth(),
            viewYear = this.props.viewDate.getFullYear(),
            lastDateOfMonth = new Date(viewYear, viewMonth, new Date(viewYear, viewMonth + 1, 0).getDate()),
            firstDateOfMonth = new Date(viewYear, viewMonth, 1),
            firstDateOfWeekMS = firstDateOfMonth.getTime() - firstDateOfMonth.getDay() * MS_IN_DAY,
            weeks = [];

        for (let n = 1; firstDateOfWeekMS <= lastDateOfMonth.getTime();
            firstDateOfWeekMS = firstDateOfWeekMS + 7 * MS_IN_DAY, n++) {

            weeks.push(
                <Week key = {n} selDate={selDate} firstDateOfWeekMS={firstDateOfWeekMS} viewMonth={viewMonth}
                    viewYear={viewYear} period={period} />
            );
        }

        return (
            <tbody className='monthTable'>
                {weeks}
            </tbody>
        );
    }
});


const CalendarWidget = React.createClass({
    getInitialState: function() {
        return {
            selDate: this.props.selDate,
            viewDate: this.props.selDate,
            period: this.props.period
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.selDate.getTime() !== nextProps.selDate.getTime()
            || this.props.period !== nextProps.period) {
                this.setState({
                    selDate: nextProps.selDate,
                    viewDate: nextProps.selDate,
                    period: nextProps.period
                })
            }
    },

    getPrevMonth: function() {
        let year = this.state.viewDate.getFullYear(),
            month = this.state.viewDate.getMonth(),
            day = this.state.viewDate.getDate();
        this.setState({viewDate: new Date(year, month - 1, day)});
    },

    getNextMonth: function() {
        let year = this.state.viewDate.getFullYear(),
            month = this.state.viewDate.getMonth(),
            day = this.state.viewDate.getDate();
        this.setState({viewDate: new Date(year, month + 1, day)});
    },

    render: function() {
        return (
            <div className='nav-date'>
                <div className='nav-title'>
                    <div onClick={this.getPrevMonth}>
                        <i className='fa fa-chevron-circle-left' aria-hidden='true' />
                    </div>
                    <div id='curr-month' data-month={this.state.viewDate.getMonth()}
                        data-year={this.state.viewDate.getFullYear()}>
                        {MONTH_NAMES[this.state.viewDate.getMonth()] + ' ' + this.state.viewDate.getFullYear()}
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
                    <Month selDate={this.state.selDate} viewDate={this.state.viewDate}
                        period={this.state.period}/>
                </table>
            </div>
        );
    }
});


export default CalendarWidget;
