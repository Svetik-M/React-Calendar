'use strict'

import React from 'react';
import requests from './request.js';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MS_IN_HOUR = 3600000;

var IventsOfDay = React.createClass({
    // componentWillReceiveProps: function(nextProps) {
    //     var events = requests.getDayEvents(nextProps.day);
    //
    // },

    render: function() {
        var date = this.props.day,
            DOW_date = DAYS_OF_WEEK[date.getDay()],
            titleTable = (<td className='event'>
                             {DOW_date +' '+ date.getDate() +'/'+ (+date.getMonth()+1)}
                         </td>),
            rows = Array.from({length:24}),
            time = 0,
            timeStr;
        rows = rows.map(function(v,i) {
            if (i === 0) timeStr = '12am';
            else if (i < 12) timeStr = i + 'am';
            else if (i === 12) timeStr = '12pm';
            else if (i > 12) timeStr = i-12 + 'pm';
            return (
                <tr key={i}>
                    <td className='time'>{timeStr}</td>
                    <td className='event'>
                        <div className={'half ' + (time + i * MS_IN_HOUR)}></div>
                        <div className={'half ' + (time + i * MS_IN_HOUR + MS_IN_HOUR/2)}></div>
                    </td>
                </tr>
            );
        });

        return (
            <div className='events-block'>
                <table className='date'>
                    <tbody>
                        <tr>
                            <td className='time'></td>
                            {titleTable}
                        </tr>
                    </tbody>
                </table>
                <table className='event-list'>
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


export {IventsOfDay};
