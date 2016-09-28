'use strict'


import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import TitleMenu from './components/title-menu.jsx';
import SidebarMenu from './components/sidebar-menu.jsx';
import EventsTable from './components/events-table.jsx';
import Event from './components/event.jsx';
import AuthorizationForm from './auth/auth.jsx';

import '../styles/style.scss';


let date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());


const AppView = React.createClass({
    getInitialState: function() {
        return {
            selDate: date,
            period: 'month',
            visEventForm: false
        };
    },

    changePeriod: function(event) {
        let target = event.target;

        if (target.id === 'day' || target.id === 'week' || target.id === 'month') {
            let state = this.state;
            state.period = target.id;
            this.setState(state);

        } else if (target.id === 'today') {
            let state = this.state;
            state.selDate = date;
            state.period = 'day';
            this.setState(state);

        } else if (target.id === 'prev-period' || target.id === 'next-period'){
            let year = this.state.selDate.getFullYear(),
                month = this.state.selDate.getMonth(),
                prevDate = this.state.selDate.getDate(),
                selectedDate;

            if (target.id === 'prev-period') {
                if (this.state.period === 'day') {
                    selectedDate = new Date(year, month, prevDate - 1);
                } else if (this.state.period === 'week') {
                    selectedDate = new Date(year, month, prevDate - 7);
                } else if (this.state.period === 'month') {
                    selectedDate = new Date(year, month - 1, prevDate);
                }

            } else if (target.id === 'next-period') {
                if (this.state.period === 'day') {
                    selectedDate = new Date(year, month, prevDate + 1);
                } else if (this.state.period === 'week') {
                    selectedDate = new Date(year, month, prevDate + 7);
                } else if (this.state.period === 'month') {
                    selectedDate = new Date(year, month + 1, prevDate);
                }
            }

            let state = this.state;
            state.selDate = selectedDate;
            this.setState(state);
        }
    },

    sidebarEventHandler: function(event) {
        let target = event.target;

        if (target.className.includes('curr-month')
            || target.className.includes('other-month')) {
            let state = this.state;
            state.selDate = new Date(+target.id);
            this.setState(state);

        } else if (target.parentElement.className === 'create-event'
                   || target.className === 'create-event') {
            let state = this.state;
            state.visEventForm = true;
            this.setState(state);
        }
    },

    hidingEventForm: function(e) {
        let target = e.target;
        if (target.className === 'button create') {
            let state = this.state;
            state.visEventForm = false;
            this.setState(state);
        }
    },

    render: function() {
        return (
            <div>
                <div onClick={this.changePeriod}>
                    <TitleMenu selDate={this.state.selDate} period={this.state.period} />
                </div>
                <div className='page-body'>
                    <div onClick={this.sidebarEventHandler}>
                        <SidebarMenu selDate={this.state.selDate} period={this.state.period} />
                    </div>
                    <div onClick={this.hidingEventForm}>
                        <EventsTable selDate={this.state.selDate} period={this.state.period}
                            visEventForm={this.state.visEventForm} />
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path='/user' component={AppView} />
        <Route path='/:form' component={AuthorizationForm} />
    </Router>,
    document.getElementById('content')
);
