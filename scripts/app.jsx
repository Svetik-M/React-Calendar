'use strict'

import React from 'react';
import ReactDOM from 'react-dom';

import {AuthorizationForm} from './signup-login.jsx';
import {TitleMenu} from './title-menu.jsx';
import {SidebarMenu} from './sidebar-menu.jsx';
import {IventsOfDay} from './day.jsx';
import {IventsOfWeek} from './week.jsx';
import {IventsOfMonth} from './month.jsx';

import '../styles/style.scss';

var userID = 123456;

var date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

var Period = React.createClass({
    render: function() {
        if (this.props.period === 'day') {
            return <IventsOfDay day={this.props.day} />;
        } else if (this.props.period === 'week') {
            return <IventsOfWeek day={this.props.day} />;
        } else if (this.props.period === 'month') {
            return <IventsOfMonth day={this.props.day} />;
        }
    }
});

var App = React.createClass({
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

            this.setState( function(previousState) {
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
        if (userID) {
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
                            <Period day={this.state.day} period={this.state.period} />
                        </div>
                    </div>
                </div>
            );
        } else return (
            <AuthorizationForm />
        )
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('content')
);
