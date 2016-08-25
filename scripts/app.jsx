'use strict'

import React from 'react';
import ReactDOM from 'react-dom';

import {AuthorizationForm} from './signup-login.jsx';
import {TitleMenu} from './title-menu.jsx';
import {SidebarMenu} from './sidebar-menu.jsx';
import {IventsOfDay} from './day.jsx';
import {IventsOfWeek} from './week.jsx';
import {IventsOfMonth} from './month.jsx';

//import {renderCalendarWidget, getSelectedPeriod} from "./calendar-widget.jsx";
//import renderDay from './day.jsx';
//import renderWeek from './week.jsx';
//import renderMonth from './month.jsx';

import '../styles/style.scss';


// var App = React.createClass({
//     render: function() {
//         return (
//             <div>
//                 <TitleMenu />
//                 <div className='page-body'>
//                     <SidebarMenu />
//                     <IventsOfWeek />
//                 </div>
//             </div>
//         );
//     }
// });

var App = React.createClass({
    render: function() {
        return (
            <AuthorizationForm />
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('content')
);

// //Event handlers
// renderCalendarWidget(new Date);
//
// function eventService() {
    // var state = 'week',
    //     monthNames = ['January', 'February', 'March', 'April',
    //                   'May', 'June', 'July', 'August',
    //                   'September', 'October', 'November', 'December'],
    //     date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
    //     period = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    //
    // renderCalendarWidget(date);
    // getSelectedPeriod(period);
    // clickEventHendlerForCalendar(document.getElementById('' + date.getTime()));
    //
    //
    // document.getElementsByClassName('fa-chevron-circle-left')[0].addEventListener('click', function() {
    //     renderCalendarWidget(new Date(+document.getElementById('month').getAttribute('data-year'),
    //                       +document.getElementById('month').getAttribute('data-month')-1));
    //
    // });
    //
    // document.getElementsByClassName('fa-chevron-circle-right')[0].addEventListener('click', function() {
    //     renderCalendarWidget(new Date(+document.getElementById('month').getAttribute('data-year'),
    //                       +document.getElementById('month').getAttribute('data-month')+1));
    // });
    //
    //
    // //Click event hendler on Calendar
    // function clickEventHendlerForCalendar(target) {
    //     var el = document.querySelector('.calendar .click-calendar');
    //
    //     date = new Date(parseInt(target.getAttribute('id')));
    //
    //     if (el) {
    //         if (el.className === 'curr-month today click-calendar') {
    //             el.className = 'curr-month today';
    //         } else {
    //             el.className = 'curr-month';
    //         }
    //     }
    //
    //     if (target.className === 'curr-month today') {
    //         target.className = 'curr-month today click-calendar';
    //     } else if (target.className === 'curr-month') {
    //         target.className = 'curr-month click-calendar';
    //     } else {
    //         renderCalendarWidget(date);
    //         var day = date.getDay()+1;
    //         if (date.getDate() < 7) {
    //             target = document.querySelector('.calendar tbody tr:first-child td:nth-child('+day+')');
    //         } else {
    //             target = document.querySelector('.calendar tbody tr:last-child td:nth-child('+day+')');
    //         }
    //         target.className = 'curr-month click-calendar';
    //     }
    //
    //     if (state === 'day') {
    //
    //         period = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    //         getSelectedPeriod(period);
    //         renderDay(date);
    //
    //     } else if (state === 'week') {
    //
    //         let week = document.querySelector('.calendar .selectedWeek'),
    //             thisWeek = target.parentElement,
    //             firstDay = new Date(parseInt(thisWeek.firstElementChild.getAttribute('id'))),
    //             lastDay = new Date (parseInt(thisWeek.lastElementChild.getAttribute('id')));
    //
    //         if (firstDay.getFullYear() !== lastDay.getFullYear()) {
    //             period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ', ' +
    //                      firstDay.getFullYear() + ' - ' + monthNames[lastDay.getMonth()].slice(0,3) + ' ' +
    //                      lastDay.getDate() + ', ' + lastDay.getFullYear();
    //         } else if (firstDay.getMonth() === lastDay.getMonth()) {
    //             period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
    //                      lastDay.getDate() + ', ' + firstDay.getFullYear();
    //         } else {
    //             period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
    //                      monthNames[lastDay.getMonth()].slice(0,3) + ' ' + lastDay.getDate() + ', ' +
    //                      firstDay.getFullYear();
    //         }
    //
    //         getSelectedPeriod(period);
    //         if (week) week.removeAttribute('class');
    //         renderWeek(date);
    //         thisWeek.className = 'selectedWeek';
    //
    //     } else {
    //
    //         let thisMonth = document.querySelector('.calendar .monthTable')
    //         period = monthNames[date.getMonth()] + ' ' + date.getFullYear();
    //         getSelectedPeriod(period);
    //         renderMonth(date);
    //         thisMonth.className =  'monthTable selectedMonth';
    //
    //     }
    // }
    //
    // document.querySelector('.sidebar-menu .nav-date').addEventListener('click', function(event) {
    //     var target = event.target;
    //     if (target.tagName === 'TD') clickEventHendlerForCalendar(target);
    // });
    //
    //
    // //Click event hendler on "Today"
    // document.querySelector('.title-menu .nav-today').addEventListener('click', function() {
    //     var el = document.querySelector('.calendar .click-calendar'),
    //         week = week = document.querySelector('.calendar .selectedWeek'),
    //         month = document.querySelector('.calendar .selectedMonth'),
    //         today = new Date();
    //
    //     period = monthNames[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();
    //     getSelectedPeriod(period);
    //     renderDay(new Date());
    //     if (!document.querySelector('.calendar .today')) renderCalendarWidget(today);
    //
    //     if (el && el.className !== 'curr-month today click-calendar') el.className = 'curr-month';
    //     if(week) week.removeAttribute('class');
    //     if(month) month.className = 'monthTable';
    //
    //     document.querySelector('.calendar .today').className = 'curr-month today click-calendar';
    //     state = 'day';
    // });
    //
    //
    // //Click event hendler on "Day"
    // function clickEventHendlerForDay() {
    //     var week = document.querySelector('.calendar .selectedWeek'),
    //         month = document.querySelector('.calendar .selectedMonth');
    //
    //     if (!document.querySelector('.calendar .click-calendar')) {
    //         renderCalendarWidget(date);
    //         document.getElementById('' + date.getTime()).className = 'curr-month click-calendar';
    //     }
    //
    //     if(week) week.removeAttribute('class');
    //     if(month) month.className = 'monthTable';
    //     period = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    //     getSelectedPeriod(period);
    //     renderDay(date);
    //     state = 'day';
    // }
    //
    // document.querySelector('.period-block .day').addEventListener('click', clickEventHendlerForDay);
    //
    //
    //
    // //Click event hendler on "Week"
    // function clickEventHendlerForWeek() {
    //     var el = document.querySelector('.calendar .click-calendar'),
    //         month = document.querySelector('.calendar .selectedMonth'),
    //         firstDay,
    //         lastDay,
    //         thisWeek;
    //
    //     if (el) {
    //         thisWeek = el.parentElement;
    //     } else {
    //         renderCalendarWidget(date);
    //         thisWeek = document.getElementById('' + date.getTime()).parentElement;
    //     }
    //
    //     firstDay = new Date(parseInt(thisWeek.firstElementChild.getAttribute('id')));
    //     lastDay = new Date (parseInt(thisWeek.lastElementChild.getAttribute('id')));
    //     if (firstDay.getFullYear() !== lastDay.getFullYear()) {
    //         period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ', ' +
    //                  firstDay.getFullYear() + ' - ' + monthNames[lastDay.getMonth()].slice(0,3) + ' ' +
    //                  lastDay.getDate() + ', ' + lastDay.getFullYear();
    //     } else if (firstDay.getMonth() === lastDay.getMonth()) {
    //         period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
    //                  lastDay.getDate() + ', ' + firstDay.getFullYear();
    //     } else {
    //         period = monthNames[firstDay.getMonth()].slice(0,3) + ' ' + firstDay.getDate() + ' - ' +
    //                  monthNames[lastDay.getMonth()].slice(0,3) + ' ' + lastDay.getDate() + ', ' +
    //                  firstDay.getFullYear();
    //     }
    //
    //     renderWeek(date);
    //     getSelectedPeriod(period);
    //     if (month) month.className = 'monthTable';
    //     thisWeek.className = 'selectedWeek';
    //     state = 'week';
    // }
    //
    // document.querySelector('.period-block .week').addEventListener('click', clickEventHendlerForWeek);
    //
    //
    // //Click event hendler on "Month"
    // function clickEventHendlerForMonth() {
    //     var thisMonth;
    //
    //     if (!document.querySelector('.calendar .click-calendar')) renderCalendarWidget(date);
    //     thisMonth = document.querySelector('.calendar .monthTable');
    //
    //     period = monthNames[date.getMonth()] + ' ' + date.getFullYear();
    //     renderMonth(date);
    //     getSelectedPeriod(period);
    //     thisMonth.className =  'monthTable selectedMonth';
    //     state = 'month';
    // }
    //
    // document.querySelector('.period-block .month').addEventListener('click', clickEventHendlerForMonth);
    //
    //
    // //Click event hendler on icon "Previous"
    // document.querySelector('.title-menu .fa-arrow-circle-left').addEventListener('click', function() {
    //     var msInDay = 86400000,
    //         prevDate,
    //         elem;
    //
    //     if (state === 'day') {
    //         prevDate = date.getTime() - msInDay;
    //     } else if (state === 'week') {
    //         prevDate = date.getTime() - 7*msInDay;
    //     } else if (state === 'month') {
    //         prevDate = new Date(date.getFullYear(), + date.getMonth()-1, date.getDate()).getTime();
    //     }
    //
    //     elem = document.getElementById('' + prevDate);
    //     if (!elem) {
    //         renderCalendarWidget(new Date(prevDate));
    //         elem = document.getElementById('' + prevDate);
    //     }
    //
    //     clickEventHendlerForCalendar(elem);
    //     date = new Date(prevDate);
    // });
    //
    //
    // //Click event hendler on icon "Next"
    // document.querySelector('.title-menu .fa-arrow-circle-right').addEventListener('click', function() {
    //     var msInDay = 86400000,
    //         nextDate,
    //         elem;
    //
    //     if (state === 'day') {
    //         nextDate = date.getTime() + msInDay;
    //     } else if (state === 'week') {
    //         nextDate = date.getTime() + 7*msInDay;
    //     } else if (state === 'month') {
    //         nextDate = new Date(date.getFullYear(), +date.getMonth()+1, date.getDate()).getTime();
    //     }
    //
    //     elem = document.getElementById('' + nextDate);
    //     if (!elem) {
    //         renderCalendarWidget(new Date(nextDate));
    //         elem = document.getElementById('' + nextDate);
    //     }
    //
    //     clickEventHendlerForCalendar(elem);
    //     date = new Date(nextDate);
    // });
// }
// eventService();
