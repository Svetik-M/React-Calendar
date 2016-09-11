'use strict'

import React from 'react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 360000;


var IventsOfWeek = React.createClass({
    render: function() {
        var date = this.props.day,
            DOW_date = date.getDay(),
            firstDay = date.getTime() - DOW_date*MS_IN_DAY;

        var titleTable = Array.from({length:7});

        titleTable = titleTable.map(function(v,i) {
            var day = new Date(firstDay + i * MS_IN_DAY).getDate(),
                month = parseInt(new Date(firstDay + i * MS_IN_DAY).getMonth())+1,
                year = new Date(firstDay + i * MS_IN_DAY).getFullYear();

            return (<td key={i} className='event'>
                        {DAYS_OF_WEEK[i] +' '+ day +'/'+ month}
                    </td>);
        });

        var timeRows = Array.from({length:24}),
            time;
        timeRows = timeRows.map(function(v,i) {
            var eventsDOW  = Array.from({length:7}),
                d = new Date(),
                today = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

            if (i === 0) time = '12am';
            else if (i < 12) time = i + 'am';
            else if (i === 12) time = '12pm';
            else if (i > 12) time = i-12 + 'pm';

            eventsDOW = eventsDOW.map(function(v,i) {
                var bool = (firstDay + i * MS_IN_DAY === today),
                    date = firstDay + i * MS_IN_DAY;
                return (<td key={i} className={bool ? 'event curr-day' : 'event'}>
                           <div key={i+.0} className={'half ' + (date + ' ' + (time + i * MS_IN_HOUR))}>
                           </div>
                           <div key={i+.1} className={'half ' + (date + ' ' + (time + i * MS_IN_HOUR + MS_IN_HOUR/2))}>
                           </div>
                       </td>)
            });
            return (
                <tr key={i}>
                    <td className='time'>{time}</td>
                    {eventsDOW}
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
                        {timeRows}
                    </tbody>
                </table>
            </div>
        )
    }
});


export {IventsOfWeek};
