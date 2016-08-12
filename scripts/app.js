'use strict'


function createWeek(firstDay, dateFirst, msInDay) {
    var days = Array.from({length: 7}),
        today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    days = days.map(function(v,i) {
        var day = new Date(firstDay + i*msInDay);
        if (day.getMonth() !== dateFirst.getMonth()) {
            return <td key={i} className='other-month' id={day.getTime()}>{day.getDate()}</td>;
        } else  if (day.getTime() === today.getTime()) {
            return <td key={i} className='curr-month today' id={day.getTime()}>{day.getDate()}</td>;
        } else {
            return <td key={i} className='curr-month' id={day.getTime()}>{day.getDate()}</td>;
        }
    });
    return  (
        <tr>
            {days}
        </tr>
    );
}

function createMonth(currDay, dateLast, msInDay, Week) {
    var weeks = [];
    for (let n = 1; currDay <= dateLast.getTime(); currDay = currDay + 7*msInDay, n++) {
        weeks.push(<Week key = {n} date={currDay} />)
    }
    return (
        <tbody className='monthTable'>
            {weeks}
        </tbody>
    );
}


//Render Calendar Widget

function calendar(date) {
    var month = date.getMonth(),
        year = date.getFullYear(),
        lastDayOfMonth = new Date(year ,month+1, 0).getDate(),
        dateLast = new Date(year, month, lastDayOfMonth),
        dateFirst = new Date(year, month, 1),
        DOW_last = dateLast.getDay(),
        DOW_first = dateFirst.getDay(),
        monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        msInDay = 86400000,
        currDay = dateFirst.getTime() - DOW_first * msInDay;


    var MonthNav = React.createClass({
        render: function() {
            return (<div id='month' data-month={month} data-year={year}>
                        {monthNames[month] + ' ' + year}
                    </div>);
        }
    });

    ReactDOM.render(
        <MonthNav />,
        document.getElementById('curr-month')
    );

    var Week = React.createClass({
        render: function() {
            var firstDay = this.props.date;
            return createWeek(firstDay, dateFirst, msInDay);
        }
    });

    var Month = React.createClass({
        render: function() {
            return createMonth(currDay, dateLast, msInDay, Week);
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

calendar(new Date());


//Render Main block (Day)

function getIventsOfDay(date) {
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        msInHour = 360000,
        DOW_date = daysOfWeek[date.getDay()],
        titleTable = <td className='event'>{DOW_date +' '+ date.getDate() +'/'+ (+date.getMonth()+1)}</td>;

    var rows = Array.from({length:24}),
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
                    <div className={time + i * msInHour}></div>
                    <div className={time + i * msInHour + msInHour/2}></div>
                </td>
            </tr>
        );
    });

    var IventsOfDay = React.createClass({
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
            );
        }
    });

    ReactDOM.render(
        <IventsOfDay />,
        document.getElementById('main-body')
    );
}
//getIventsOfDay(new Date());


////Render Main block (Week)

function getIventsOfWeek(date) {
    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        msInDay = 86400000,
        msInHour = 360000,
        DOW_date = date.getDay(),
        firstDay = date.getTime() - DOW_date*msInDay,
        lastDay = date.getTime() + (6 - DOW_date)*msInDay;

    var titleTable = Array.from({length:7});
    titleTable = titleTable.map(function(v,i) {
        var day = new Date(firstDay + i * msInDay).getDate(),
            month = parseInt(new Date(firstDay + i * msInDay).getMonth())+1,
            year = new Date(firstDay + i * msInDay).getFullYear();
        return <td key={i} className='event'>{daysOfWeek[i] +' '+ day +'/'+ month}</td>;
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
            var bool = (firstDay + i * msInDay === today),
                date = firstDay + i * msInDay;
            return <td key={i} className={bool ? 'event curr-day' : 'event'}>
                       <div key={i+.0} className={date + ' ' + (time + i * msInHour)}></div>
                       <div key={i+.1} className={date + ' ' + (time + i * msInHour + msInHour/2)}></div>
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
//getIventsOfWeek(new Date())


//Render Main block (Month)

function getIventsOfMonth(date) {
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        msInDay = 86400000,
        month = date.getMonth(),
        year = date.getFullYear(),
        lastDayOfMonth = new Date(year ,month+1, 0).getDate(),
        dateLast = new Date(year, month, lastDayOfMonth),
        dateFirst = new Date(year, month, 1),
        DOW_last = dateLast.getDay(),
        DOW_first = dateFirst.getDay(),
        currDay = dateFirst.getTime() - DOW_first * msInDay;

    var titleTable = Array.from({length:7});
    titleTable = titleTable.map(function(v,i) {
        return <td key={i} className='event'>{daysOfWeek[i]}</td>;
    });

    var Week = React.createClass({
        render: function() {
            var firstDay = this.props.date;
            return createWeek(firstDay, dateFirst, msInDay);
        }
    });

    var Month = React.createClass({
        render: function() {
            return createMonth(currDay, dateLast, msInDay, Week);
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
                        <Month />
                    </table>
                </div>
            )
        }
    });

    ReactDOM.render(
        <IventsOfMonth />,
        document.getElementById('main-body')
    );
}
//getIventsOfMonth(new Date())


//Render Selected period

function getSelectedPeriod(period) {
    var Period = React.createClass({
        render: function(){
            return <div>{period}</div>
        }
    });

    ReactDOM.render(
        <Period />,
        document.getElementById('selected-period')
    );
}

//Event handlers

function eventService() {
    var state = 'day',
        monthNames = ['January', 'February', 'March', 'April',
                      'May', 'June', 'July', 'August',
                      'September', 'October', 'November', 'December'],
        date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        period = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();

    getSelectedPeriod(period);
    getIventsOfDay(date);
    clickEventHendlerForCalendar(document.getElementById('' + date.getTime()));


    document.getElementsByClassName('fa-chevron-circle-left')[0].addEventListener('click', function() {
        calendar(new Date(+document.getElementById('month').getAttribute('data-year'),
                          +document.getElementById('month').getAttribute('data-month')-1));

    });

    document.getElementsByClassName('fa-chevron-circle-right')[0].addEventListener('click', function() {
        calendar(new Date(+document.getElementById('month').getAttribute('data-year'),
                          +document.getElementById('month').getAttribute('data-month')+1));
    });


    //Click event hendler on Calendar
    function clickEventHendlerForCalendar(target) {
        var el = document.querySelector('.calendar .click-calendar');

        date = new Date(parseInt(target.getAttribute('id')));

        if (el) {
            if (el.className === 'curr-month today click-calendar') {
                el.className = 'curr-month today';
            } else {
                el.className = 'curr-month';
            }
        }

        if (target.className === 'curr-month today') {
            target.className = 'curr-month today click-calendar';
        } else if (target.className === 'curr-month') {
            target.className = 'curr-month click-calendar';
        } else {
            calendar(date);
            var day = date.getDay()+1;
            if (date.getDate() < 7) {
                target = document.querySelector('.calendar tbody tr:first-child td:nth-child('+day+')');
            } else {
                target = document.querySelector('.calendar tbody tr:last-child td:nth-child('+day+')');
            }
            target.className = 'curr-month click-calendar';
        }

        if (state === 'day') {

            period = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
            getSelectedPeriod(period);
            getIventsOfDay(date);

        } else if (state === 'week') {

            let week = document.querySelector('.calendar .selectedWeek'),
                thisWeek = target.parentElement,
                firstDay = new Date(parseInt(thisWeek.firstElementChild.getAttribute('id'))),
                lastDay = new Date (parseInt(thisWeek.lastElementChild.getAttribute('id')));

            if (firstDay.getFullYear() !== lastDay.getFullYear()) {
                period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ', ' + firstDay.getFullYear() + ' - ' +
                         monthNames[lastDay.getMonth()].slice(0,3) + ' ' + lastDay.getDate() + ', ' + lastDay.getFullYear();
            } else if (firstDay.getMonth() === lastDay.getMonth()) {
                period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
                         lastDay.getDate() + ', ' + firstDay.getFullYear();
            } else {
                period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
                         monthNames[lastDay.getMonth()].slice(0,3) + ' ' + lastDay.getDate() + ', ' + firstDay.getFullYear();
            }

            getSelectedPeriod(period);
            if (week) week.removeAttribute('class');
            getIventsOfWeek(date);
            thisWeek.className = 'selectedWeek';

        } else {

            let thisMonth = document.querySelector('.calendar .monthTable')
            period = monthNames[date.getMonth()] + ' ' + date.getFullYear();
            getSelectedPeriod(period);
            getIventsOfMonth(date);
            thisMonth.className =  'monthTable selectedMonth';

        }
    }

    document.querySelector('.sidebar-menu .nav-date').addEventListener('click', function(event) {
        var target = event.target;
        if (target.tagName === 'TD') clickEventHendlerForCalendar(target);
    });


    //Click event hendler on "Today"
    document.querySelector('.title-menu .nav-today').addEventListener('click', function() {
        var el = document.querySelector('.calendar .click-calendar'),
            week = week = document.querySelector('.calendar .selectedWeek'),
            month = document.querySelector('.calendar .selectedMonth'),
            today = new Date();

        period = monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();
        getSelectedPeriod(period);
        getIventsOfDay(new Date());
        if (!document.querySelector('.calendar .today')) calendar(today);

        if (el && el.className !== 'curr-month today click-calendar') el.className = 'curr-month';
        if(week) week.removeAttribute('class');
        if(month) month.className = 'monthTable';

        document.querySelector('.calendar .today').className = 'curr-month today click-calendar';
        state = 'day';
    });


    //Click event hendler on "Day"
    function clickEventHendlerForDay() {
        var week = document.querySelector('.calendar .selectedWeek'),
            month = document.querySelector('.calendar .selectedMonth');

        if (!document.querySelector('.calendar .click-calendar')) {
            calendar(date);
            document.getElementById('' + date.getTime()).className = 'curr-month click-calendar';
        }

        if(week) week.removeAttribute('class');
        if(month) month.className = 'monthTable';
        period = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        getSelectedPeriod(period);
        getIventsOfDay(date);
        state = 'day';
    }

    document.querySelector('.title-menu .period-block .day').addEventListener('click', clickEventHendlerForDay);



    //Click event hendler on "Week"
    function clickEventHendlerForWeek() {
        var el = document.querySelector('.calendar .click-calendar'),
            month = document.querySelector('.calendar .selectedMonth'),
            firstDay,
            lastDay,
            thisWeek;

        if (el) {
            thisWeek = el.parentElement;
        } else {
            calendar(date);
            thisWeek = document.getElementById('' + date.getTime()).parentElement;
        }

        firstDay = new Date(parseInt(thisWeek.firstElementChild.getAttribute('id')));
        lastDay = new Date (parseInt(thisWeek.lastElementChild.getAttribute('id')));
        if (firstDay.getFullYear() !== lastDay.getFullYear()) {
            period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ', ' + firstDay.getFullYear() + ' - ' +
                     monthNames[lastDay.getMonth()].slice(0,3) + ' ' + lastDay.getDate() + ', ' + lastDay.getFullYear();
        } else if (firstDay.getMonth() === lastDay.getMonth()) {
            period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
                     lastDay.getDate() + ', ' + firstDay.getFullYear();
        } else {
            period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
                     monthNames[lastDay.getMonth()].slice(0,3) + ' ' + lastDay.getDate() + ', ' + firstDay.getFullYear();
        }

        getIventsOfWeek(date);
        getSelectedPeriod(period);
        if (month) month.className = 'monthTable';
        thisWeek.className = 'selectedWeek';
        state = 'week';
    }

    document.querySelector('.title-menu .period-block .week').addEventListener('click', clickEventHendlerForWeek);


    //Click event hendler on "Month"
    function clickEventHendlerForMonth() {
        var thisMonth;

        if (!document.querySelector('.calendar .click-calendar')) calendar(date);
        thisMonth = document.querySelector('.calendar .monthTable');

        period = monthNames[date.getMonth()] + ' ' + date.getFullYear();
        getIventsOfMonth(date);
        getSelectedPeriod(period);
        thisMonth.className =  'monthTable selectedMonth';
        state = 'month';
    }

    document.querySelector('.title-menu .period-block .month').addEventListener('click', clickEventHendlerForMonth);


    //Click event hendler on icon "Previous"
    document.querySelector('.title-menu .fa-arrow-circle-left').addEventListener('click', function() {
        var msInDay = 86400000,
            prevDate,
            elem;

        if (state === 'day') {
            prevDate = date.getTime() - msInDay;
        } else if (state === 'week') {
            prevDate = date.getTime() - 7*msInDay;
        } else if (state === 'month') {
            prevDate = new Date(date.getFullYear(), + date.getMonth()-1, date.getDate()).getTime();
        }

        elem = document.getElementById('' + prevDate);
        if (!elem) {
            calendar(new Date(prevDate));
            elem = document.getElementById('' + prevDate);
        }

        clickEventHendlerForCalendar(elem);
        date = new Date(prevDate);
    });


    //Click event hendler on icon "Next"
    document.querySelector('.title-menu .fa-arrow-circle-right').addEventListener('click', function() {
        var msInDay = 86400000,
            nextDate,
            elem;

        if (state === 'day') {
            nextDate = date.getTime() + msInDay;
        } else if (state === 'week') {
            nextDate = date.getTime() + 7*msInDay;
        } else if (state === 'month') {
            nextDate = new Date(date.getFullYear(), +date.getMonth()+1, date.getDate()).getTime();
        }

        elem = document.getElementById('' + nextDate);
        if (!elem) {
            calendar(new Date(nextDate));
            elem = document.getElementById('' + nextDate);
        }

        clickEventHendlerForCalendar(elem);
        date = new Date(nextDate);
    });
}
eventService();
