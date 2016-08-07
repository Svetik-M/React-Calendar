'use strict'


//Render Calendar Widget

var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

function calendar(year, month) {
    var lastDayOfMonth = new Date(year ,month+1, 0).getDate(),
        dateLast = new Date(year, month, lastDayOfMonth),
        dateFirst = new Date(year, month, 1),
        DOW_last = dateLast.getDay(),
        DOW_first = dateFirst.getDay(),
        monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        msInDay = 86400000,
        currDay = dateFirst.getTime() - DOW_first * msInDay;;


    var MonthNav = React.createClass({
        render: function() {
            return (<div id='month' data-month={dateFirst.getMonth()} data-year={dateFirst.getFullYear()}>
                        {monthNames[dateFirst.getMonth()] + ' ' + dateFirst.getFullYear()}
                    </div>);
        }
    });

    ReactDOM.render(
        <MonthNav />,
        document.getElementById('curr-month')
    );

    var Week = React.createClass({
        render: function() {
            var firstDay = this.props.date
            var days = Array.from({length: 7});
            days = days.map((v,i) => {
                var day = new Date(firstDay + i*msInDay);
                if (day.getMonth() !== dateFirst.getMonth()) {
                    return <td key={i} className='other-month' data-date={day}>{day.getDate()}</td>;
                } else  if (day.getTime() === today.getTime()) {
                    return <td key={i} className='curr-month' id='today' data-date={day}>{day.getDate()}</td>;
                } else {
                    return <td key={i} className='curr-month' data-date={day}>{day.getDate()}</td>;
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
                        <tr><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td></tr>
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

document.querySelector('.nav-date').onclick = function(event) {
    var el = document.getElementsByClassName('click-calendar')[0],
        target = event.target,
        date = new Date(target.getAttribute('data-date'));
    if (target.tagName !== 'TD') return;
    if (el) el.className = 'curr-month';
    if (target.className === 'curr-month') {
        target.className = 'curr-month click-calendar';
    } else {
        calendar(date.getFullYear(), date.getMonth());
        var day = date.getDay()+1;
        if (date.getDate() < 7) {
            target = document.querySelector('.calendar tbody tr:first-child td:nth-child('+day+')');
        } else {
            target = document.querySelector('.calendar tbody tr:last-child td:nth-child('+day+')');
        }
        target.className = 'curr-month click-calendar';
    }
    getIventOfDay(date);
}


//Render Main block (Day)

function getIventOfDay(date) {
    var daysOfWeek = ['Sanday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        DOW_date = daysOfWeek[date.getDay()],
        day = date.getDate(),
        month = date.getMonth()+1,
        year = date.getFullYear();

    var IventOfDay = React.createClass({
        render: function() {
            var rows = Array.from({length:24}),
                time;
            rows = rows.map((v,i) => {
                if (i === 0) time = '12am';
                else if (i < 12) time = i + 'am';
                else if (i === 12) time = '12pm';
                else if (i > 12) time = i-12 + 'pm';
                return (
                    <tr key={i}>
                        <td className='time'>{time}</td>
                        <td className='event' id={day+'-'+month+'-'+year+'-'+time}></td>
                    </tr>
                );
            });
            return (
                <div className='events-of-day'>
                    <table className='date'>
                        <tbody>
                            <tr>
                                <td className='time'></td>
                                <td className='event'>{DOW_date +' '+ day +'/'+ month +'/'+ year}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='event-list'>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            )
        }
    });

    ReactDOM.render(
        <IventOfDay />,
        document.getElementById('main-body')
    );
}
getIventOfDay(new Date())
