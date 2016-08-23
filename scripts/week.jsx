'use strict'

import React from 'react';
import ReactDOM from 'react-dom';


export default function renderWeek(date) {
    const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MS_IN_DAY = 86400000;
    const MS_IN_HOUR = 360000;

    var DOW_date = date.getDay(),
        firstDay = date.getTime() - DOW_date*MS_IN_DAY,
        lastDay = date.getTime() + (6 - DOW_date)*MS_IN_DAY;

    var titleTable = Array.from({length:7});
    titleTable = titleTable.map(function(v,i) {
        var day = new Date(firstDay + i * MS_IN_DAY).getDate(),
            month = parseInt(new Date(firstDay + i * MS_IN_DAY).getMonth())+1,
            year = new Date(firstDay + i * MS_IN_DAY).getFullYear();
        return <td key={i} className='event'>{DAYS_OF_WEEK[i] +' '+ day +'/'+ month}</td>;
    });

    var rows = Array.from({length:24}),
        time;
    rows = rows.map(function(v,i) {
        var eventsDOW  = Array.from({length:7}),
            today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();

        if (i === 0) time = '12am';
        else if (i < 12) time = i + 'am';
        else if (i === 12) time = '12pm';
        else if (i > 12) time = i-12 + 'pm';

        eventsDOW = eventsDOW.map(function(v,i) {
            var bool = (firstDay + i * MS_IN_DAY === today),
                date = firstDay + i * MS_IN_DAY;
            return <td key={i} className={bool ? 'event curr-day' : 'event'}>
                       <div key={i+.0} className={date + ' ' + (time + i * MS_IN_HOUR)}></div>
                       <div key={i+.1} className={date + ' ' + (time + i * MS_IN_HOUR + MS_IN_HOUR/2)}></div>
                   </td>
        });
        return (
            <tr key={i}>
                <td className='time'>{time}</td>
                {eventsDOW}
            </tr>
        );
    });

    var IventsOfWeek = React.createClass({
        render: function() {
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
            )
        }
    });

    ReactDOM.render(
        <IventsOfWeek />,
        document.getElementById('main-body')
    );
}

//export {renderWeek};
