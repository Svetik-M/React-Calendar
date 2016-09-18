'use strict'

import React from 'react';
import {Event} from './event.jsx';
import getEvents from './get-events.js';


const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000;


var IventsOfDay = React.createClass({
    getInitialState: function() {
        return {
            events: Array.from({length: 49})
        }
    },

    componentWillReceiveProps: function(nextProps) {
        getEvents.sortDayEventsByHour.call(this, nextProps.events);
    },

    componentWillMount: function() {
        getEvents.sortDayEventsByHour.call(this, this.props.events);
    },

    render: function() {
        var date = this.props.day,
            midnight = date.getTime(),
            DOW_date = DAYS_OF_WEEK[date.getDay()],
            titleTable = (<td className='events-group'>
                             {DOW_date +' '+ date.getDate() +'/'+ (+date.getMonth()+1)}
                         </td>),
            events = this.state.events,
            rows = Array.from({length:25}),
            time = 0,
            timeStr,
            call = this;

        events = events.map(function(value, index){
            if (value === undefined) {
                return value;
            } else {
                let arr = value.map(function(item) {
                    var startDate = item.start_date,
                        endDate = item.end_date,
                        start, height, left;

                    if (startDate < midnight) {
                        start = '12:00am';
                        if (index !== 0) {
                            height = (endDate - midnight) / MS_IN_HOUR * 2 ;
                        }
                    } else {
                        start = new Date(startDate).toLocaleString('en-US',
                                {hour: '2-digit', minute: '2-digit'}).toLowerCase().replace(' ', '');

                        if (index !== 0 && endDate > midnight + MS_IN_DAY) {
                            height = (midnight + MS_IN_DAY - startDate) / MS_IN_HOUR * 2;
                        } else if (index !== 0) {
                            height = (endDate - startDate) / MS_IN_HOUR * 2;
                        }
                    }

                    return <Event key={item.id} events={call.props.events} currEvent={item} start={start}
                        scope={call.props.scope} height={height} midnight={midnight} />;
                });

                return arr;
            }
        });

        rows = rows.map(function(v, i) {
            if (i === 0) {
                return (
                    <tr key={i}>
                        <td className='time all-day'>All Day</td>
                        <td className='events-group all-day'>
                            {events[0]}
                        </td>
                    </tr>
                );
            }

            if (i === 1) timeStr = '12am';
            else if (i < 13) timeStr = (i - 1) + 'am';
            else if (i === 13) timeStr = '12pm';
            else if (i > 13) timeStr = (i - 13) + 'pm';
            return (
                <tr key={i}>
                    <td className='time'>{timeStr}</td>
                    <td className='events-group'>
                        <div className={'half ' + (time + i * MS_IN_HOUR)}>
                            <div>
                                {events[2 * i - 1]}
                            </div>
                        </div>
                        <div className={'half ' + (time + i * MS_IN_HOUR + MS_IN_HOUR/2)}>
                            <div>
                                {events[2 * i]}
                            </div>
                        </div>
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
                <table className='events-list day'>
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

function getCoords(elem) {
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
    right: box.right + pageXOffset,
    bottom: box.bottom + pageYOffset
  };

}


export {IventsOfDay};
