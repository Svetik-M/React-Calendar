'use strict'


import React from 'react';


const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];
const MS_IN_DAY = 86400000;


function getWeekPeriod(date) {
    let currDOW = date.getDay(),
        firstDay = new Date(date.getTime() - currDOW * MS_IN_DAY),
        lastDay = new Date (date.getTime() + (6 - currDOW) * MS_IN_DAY),
        periodStr;

        if (firstDay.getFullYear() !== lastDay.getFullYear()) {
            periodStr = MONTH_NAMES[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ', ' +
                     firstDay.getFullYear() + ' - ' + MONTH_NAMES[lastDay.getMonth()].slice(0,3) + ' ' +
                     lastDay.getDate() + ', ' + lastDay.getFullYear();
        } else if (firstDay.getMonth() === lastDay.getMonth()) {
            periodStr = MONTH_NAMES[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
                     lastDay.getDate() + ', ' + firstDay.getFullYear();
        } else {
            periodStr = MONTH_NAMES[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
                     MONTH_NAMES[lastDay.getMonth()].slice(0,3) + ' ' + lastDay.getDate() + ', ' +
                     firstDay.getFullYear();
        }
    return {
        periodStr: periodStr
    }
}


const SelectedPeriod = React.createClass({
    getInitialState: function() {
        let date = this.props.selDate;
        return {periodStr: MONTH_NAMES[date.getMonth()] + ' ' + date.getFullYear()};
    },

    componentWillReceiveProps: function(nextProps) {
        let date = nextProps.selDate;
        if (nextProps.period === 'day') {
            this.setState({
                periodStr: MONTH_NAMES[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
            });
        } else if (nextProps.period === 'week') {
            this.setState(getWeekPeriod(date));
        } else if (nextProps.period === 'month') {
            this.setState({periodStr: MONTH_NAMES[date.getMonth()] + ' ' + date.getFullYear()})
        }
    },

    render: function(){
        return <div className='selected-period'>{this.state.periodStr}</div>
    }
});


export default SelectedPeriod;
