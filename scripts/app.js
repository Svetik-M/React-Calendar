'use strict'


//Render Calendar Widget

function calendar(year, month) {
    var lastDayOfMonth = new Date(year ,month+1, 0).getDate(),
        dateLast = new Date(year, month, lastDayOfMonth),
        dateFirst = new Date(year, month, 1),
        DOW_last = dateLast.getDay(),
        DOW_first = dateFirst.getDay(),
        monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        msInDay = 86400000,
        currDay;

    var MonthNav = React.createClass({
        render: function() {
            return <div id='month'>{monthNames[dateFirst.getMonth()] + ' ' + dateFirst.getFullYear()}</div>;
        }
    });

    ReactDOM.render(
        <MonthNav />,
        document.getElementById('curr-month')
    );

    document.getElementById('month').dataset.month = dateFirst.getMonth();
    document.getElementById('month').dataset.year = dateFirst.getFullYear();

    if (DOW_first > 1) {
        currDay = dateFirst.getTime() - (DOW_first - 1) * msInDay;
    } else if (DOW_first === 0) {
        currDay = dateFirst.getTime() - 6 * msInDay;
    } else {
        currDay = dateFirst.getTime();
    }

    var Week = React.createClass({
        render: function() {
            var firstDay = this.props.date
            var days = Array.from({length: 7});
            days = days.map((v,i) => {
                var day = new Date(firstDay + i*msInDay);
                if (day.getMonth() !== dateFirst.getMonth()) {
                    return <td key={i} className='other-month'>{day.getDate()}</td>;
                } else {
                    return <td key={i} className='curr-month'>{day.getDate()}</td>;
                }
            });
            return  (
                <tr>
                    {days}
                </tr>
            );
        }
    });

    var Month = React.createClass({
        render: function() {
            var weeks = [];
            for (let n = 1; currDay <= dateLast.getTime(); currDay = currDay + 7*msInDay, n++) {
                weeks.push(<Week key = {n} date={currDay} />)
            }
            return (
                <tbody>
                    {weeks}
                </tbody>
            );
        }
    });

    var Calendar = React.createClass({
        render: function() {
            return (
                <table className='calendar'>
                    <thead>
                        <tr><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td><td>Sun</td></tr>
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
calendar(new Date().getFullYear(), new Date().getMonth());

document.getElementsByClassName('fa-chevron-circle-left')[0].onclick = function() {
    calendar(+document.getElementById('month').getAttribute('data-year'), +document.getElementById('month').getAttribute('data-month')-1);
}

document.getElementsByClassName('fa-chevron-circle-right')[0].onclick = function() {
    calendar(+document.getElementById('month').getAttribute('data-year'), +document.getElementById('month').getAttribute('data-month')+1);
}
