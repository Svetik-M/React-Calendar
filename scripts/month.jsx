'use strict'

import React from 'react';
import {createWeek} from './calendar-widget.jsx';
import {createMonth} from './calendar-widget.jsx';


const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MS_IN_DAY = 86400000;


var titleTable = Array.from({length:7});
titleTable = titleTable.map(function(v,i) {
    return <td key={i} className='event'>{DAYS_OF_WEEK[i]}</td>;
});


var Week = React.createClass({
    render: function() {
        var firstDay = this.props.date.getTime(),
            dateFirst = new Date(this.props.year, this.props.month, 1);
        return createWeek(firstDay, dateFirst, MS_IN_DAY, this.props.day, this.props.period);
    }
});

var Month = React.createClass({
    render: function() {
        var period = this.props.period || '';
        return createMonth(MS_IN_DAY, Week, this.props.day, this.props.period);
    }
});

var IventsOfMonth = React.createClass({
    render: function() {
        return (
            <div className='events-block'>
                <table className='date'>
                    <tbody>
                        <tr>
                            {titleTable}
                        </tr>
                    </tbody>
                </table>
                <table className='event-list month'>
                    <thead>
                        <tr>
                            {titleTable}
                        </tr>
                    </thead>
                    <Month day={this.props.day} />
                </table>
            </div>
        )
    }
});


export {IventsOfMonth};
