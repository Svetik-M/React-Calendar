'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import {TitleMenu} from './title-menu.jsx';
import {SidebarMenu} from './sidebar-menu.jsx';
import {EventsTable} from './events-table.jsx';
import {Event} from './event.jsx';

import '../styles/style.scss';

var date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());


var AppView = React.createClass({
    getInitialState: function() {
        return {
            day: date,
            period: 'week',
            visEventForm: false
        };
    },

    changePeriod: function(event) {
        var target = event.target;

        if (target.id === 'day' || target.id === 'week' || target.id === 'month') {
            let state = this.state;
            state.period = target.id;
            this.setState(state);

        } else if (target.id === 'today') {
            let state = this.state;
            state.day = date;
            state.period = 'day';
            this.setState(state);

        } else if (target.id === 'prev-period' || target.id === 'next-period'){
            let year = this.state.day.getFullYear(),
                month = this.state.day.getMonth(),
                day = this.state.day.getDate(),
                selectedDate;

            if (target.id === 'prev-period') {
                if (this.state.period === 'day') {
                    selectedDate = new Date(year, month, day - 1);
                } else if (this.state.period === 'week') {
                    selectedDate = new Date(year, month, day - 7);
                } else if (this.state.period === 'month') {
                    selectedDate = new Date(year, month - 1, day);
                }

            } else if (target.id === 'next-period') {
                if (this.state.period === 'day') {
                    selectedDate = new Date(year, month, day + 1);
                } else if (this.state.period === 'week') {
                    selectedDate = new Date(year, month, day + 7);
                } else if (this.state.period === 'month') {
                    selectedDate = new Date(year, month + 1, day);
                }
            }

            let state = this.state;
            state.day = selectedDate;
            this.setState(state);
        }
    },

    sidebarEventHandler: function(event) {
        var target = event.target;
        if (target.className.includes('curr-month')
            || target.className.includes('other-month')) {
            let state = this.state;
            state.day = new Date(+target.id);
            this.setState(state);
        } else if (target.parentElement.className === 'create-event'
                   || target.className === 'create-event') {
            let state = this.state;
            state.visEventForm = true;
            this.setState(state);
        }
    },

    hidingForm: function(e) {
        var target = e.target;
        if (target.className === 'create button') {
            let state = this.state;
            state.visEventForm = false;
            this.setState(state);
        }
    },

    render: function() {
        return (
            <div>
                <div onClick={this.changePeriod}>
                    <TitleMenu day={this.state.day} period={this.state.period} />
                </div>
                <div className='page-body'>
                    <div onClick={this.sidebarEventHandler}>
                        <SidebarMenu day={this.state.day} period={this.state.period} />
                    </div>
                    <div onClick={this.hidingForm}>
                        <EventsTable day={this.state.day} period={this.state.period}
                            visEventForm={this.state.visEventForm} />
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path='/user/:userId' component={AppView} />
    </Router>,
    document.getElementById('content')
);
