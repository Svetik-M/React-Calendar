'use strict'

import React from 'react';
//import ReactDOM from 'react-dom';
import {createWeek} from './calendar-widget.jsx';
import {createMonth} from './calendar-widget.jsx';


//export default function renderMonth(date) {
    const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const MS_IN_DAY = 86400000;

    var date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        month = date.getMonth(),
        year = date.getFullYear(),
        lastDayOfMonth = new Date(year ,month+1, 0).getDate(),
        dateLast = new Date(year, month, lastDayOfMonth),
        dateFirst = new Date(year, month, 1),
        DOW_last = dateLast.getDay(),
        DOW_first = dateFirst.getDay(),
        currDay = dateFirst.getTime() - DOW_first * MS_IN_DAY;

    var titleTable = Array.from({length:7});
    titleTable = titleTable.map(function(v,i) {
        return <td key={i} className='event'>{DAYS_OF_WEEK[i]}</td>;
    });


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

    export var IventsOfMonth = React.createClass({
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
                        <Month />
                    </table>
                </div>
            )
        }
    });

//     ReactDOM.render(
//         <IventsOfMonth />,
//         document.getElementById('main-body')
//     );
// }

//export {renderMonth};
