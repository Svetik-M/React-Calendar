'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import {TitleMenu} from './title-menu.jsx';
import {SidebarMenu} from './sidebar-menu.jsx';
import {EventsTable} from './events-table.jsx';

import '../styles/style.scss';

var date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

var AppView = React.createClass({
    getInitialState: function() {
        return {
            day: date,
            period: 'week'
        };
    },

    changePeriod: function(event) {
        var target = event.target;

        if (target.id === 'day' || target.id === 'week' || target.id === 'month') {
            this.setState( function(previousState) {
                return {
                    day: previousState.day,
                    period: target.id
                };
            });

        } else if (target.id === 'today') {
            this.setState( function(previousState) {
                return {
                    day: date,
                    period: 'day'
                };
            });

        } else if (target.id === 'prev-period' || target.id === 'next-period'){
            var year = this.state.day.getFullYear(),
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

            this.setState(function(previousState) {
                return {
                    day: selectedDate,
                    period: previousState.period
                };
            });
        }
    },

    changeDay: function(event) {
        var target = event.target;
        if (target.className === 'curr-month' || target.className === 'other-month') {
            this.setState( function(previousState) {
                return {
                    day: new Date(+target.id),
                    period: previousState.period
                };
            });
        }
    },

    render: function() {
        return (
            <div>
                <div onClick={this.changePeriod}>
                    <TitleMenu day={this.state.day} period={this.state.period} />
                </div>
                <div className='page-body'>
                    <div onClick={this.changeDay}>
                        <SidebarMenu day={this.state.day} period={this.state.period} />
                    </div>
                    <div>
                        <EventsTable day={this.state.day} period={this.state.period} />
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
