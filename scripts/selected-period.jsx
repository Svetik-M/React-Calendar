'use strict'

import React from 'react';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];
const MS_IN_DAY = 86400000;


function getWeekPeriod(date) {
    var period,
        currDOW = date.getDay(),
        firstDay = new Date(date.getTime() - currDOW * MS_IN_DAY),
        lastDay = new Date (date.getTime() + (6 - currDOW) * MS_IN_DAY);

        if (firstDay.getFullYear() !== lastDay.getFullYear()) {
            period = MONTH_NAMES[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ', ' +
                     firstDay.getFullYear() + ' - ' + MONTH_NAMES[lastDay.getMonth()].slice(0,3) + ' ' +
                     lastDay.getDate() + ', ' + lastDay.getFullYear();
        } else if (firstDay.getMonth() === lastDay.getMonth()) {
            period = MONTH_NAMES[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
                     lastDay.getDate() + ', ' + firstDay.getFullYear();
        } else {
            period = MONTH_NAMES[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
                     MONTH_NAMES[lastDay.getMonth()].slice(0,3) + ' ' + lastDay.getDate() + ', ' +
                     firstDay.getFullYear();
        }
    return {
        period: period
    }
}


var SelectedPeriod = React.createClass({
    getInitialState: function() {
        var date = this.props.day;
        return {period: MONTH_NAMES[date.getMonth()] + ' ' + date.getFullYear()};
    },

    componentWillReceiveProps: function(nextProps) {
        var date = nextProps.day;
        if (nextProps.period === 'day') {
            this.setState({
                period: MONTH_NAMES[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
            });
        } else if (nextProps.period === 'week') {
            this.setState(getWeekPeriod(date));
        } else if (nextProps.period === 'month') {
            this.setState({period: MONTH_NAMES[date.getMonth()] + ' ' + date.getFullYear()})
        }
    },

    render: function(){
        return <div className='selected-period'>{this.state.period}</div>
    }
});



export {SelectedPeriod};
