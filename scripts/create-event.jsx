'use strict'

import React from 'react';
import requests from './request.js';
import {CalendarWidget} from './calendar-widget.jsx';

var date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
const MS_IN_HOUR = 3600000,
      MS_IN_MIN = 60000;
var timeZone = date.getTimezoneOffset()*MS_IN_MIN

var SelectTime = React.createClass({
    render: function() {
        var options = Array.from({length: 48}),
            time = 0,
            timeStr;
        options = options.map(function(v, i) {
            var minutes = (i%2 === 0 ? '00' : '30'),
                a = Math.floor(i/2);
            if (a === 0) timeStr = '12:' + minutes + 'am';
            else if (a < 12) timeStr = a + ':' + minutes + 'am';
            else if (a === 12) timeStr = '12:' + minutes + 'pm';
            else if (a > 12) timeStr = a-12 + ':' + minutes + 'pm';
            return <div key={i} className='time' data-time={i * MS_IN_HOUR/2 + timeZone}>{timeStr}</div>
        });
        return (
            <div>
                {options}
            </div>
        );
    }
});


var CreateEvent = React.createClass({
    getInitialState: function() {
        var ev = this.props.editableEvent;
        return {
            visible: this.props.visible,
            id: ev ? ev.id : undefined,
            eventData: {
                title: ev ? ev.title : '',
                start_date: ev ? new Date(new Date(ev.start_date).getTime() -
                                          timeZone).toLocaleString('en-US').split(',')[0]
                               : date.toLocaleString('en-US').slice(0, 10),
                start_time: ev ? ev.start_time.slice(0, -3) : timeZone,
                end_date: ev ? new Date(new Date(ev.end_date).getTime() -
                                          timeZone).toLocaleString('en-US').split(',')[0]
                               : date.toLocaleString('en-US').split(',')[0],
                end_time: ev ? ev.end_time.slice(0, -3) : timeZone,
                place: ev ? ev.place : '',
                category: ev ? ev.category : '',
                discription: ev ? ev.discription : ''
            }
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var ev =  nextProps.editableEvent;
        this.setState({
            visible: nextProps.visible,
            id: ev ? ev.id : undefined,
            eventData: {
                title: ev ? ev.title : '',
                start_date: ev ? new Date(new Date(ev.start_date).getTime() -
                                          timeZone).toLocaleString('en-US').split(',')[0]
                               : date.toLocaleString('en-US').split(',')[0],
                start_time: ev ? ev.start_time.slice(0, -3) : timeZone,
                end_date: ev ? new Date(new Date(ev.end_date).getTime() -
                                          timeZone).toLocaleString('en-US').split(',')[0]
                               : date.toLocaleString('en-US').split(',')[0],
                end_time: ev ? ev.end_time.slice(0, -3) : timeZone,
                place: ev ? ev.place : '',
                category: ev ? ev.category : '',
                discription: ev ? ev.discription : ''
            }
        });
    },

    handleChange: function(e) {
        var target = e.target,
            name = target.name,
            state = this.state;
        state.eventData[name] = target.value;
        this.setState(state);
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var form = eventData;
        requests.sendEventForm.call(this.props.scope, form, this.state.id);
    },

    changeVisible: function(e) {
        var target = e.target,
            state = Object.assign({}, this.state);
        state.visCalendarStart = false;
        state.visTimeStart = false;
        state.visCalendarEnd = false;
        state.visTimeEnd = false;
        if (target.previousElementSibling.name === 'start_date') {
            state.visCalendarStart = (!this.state.visCalendarStart);
        } else if (target.previousElementSibling.name === 'start_time') {
            state.visTimeStart = (!this.state.visTimeStart);
        } else if (target.previousElementSibling.name === 'end_date') {
            state.visCalendarEnd = (!this.state.visCalendarEnd);
        } else if (target.previousElementSibling.name === 'end_time') {
            state.visTimeEnd = (!this.state.visTimeEnd);
        }
        this.setState(state);
    },

    selectStartDate: function(e) {
        selectDate.call(this, e.target, 'start_date', 'visCalendarStart')
    },

    selectEndDate: function(e) {
        selectDate.call(this, e.target, 'end_date', 'visCalendarEnd')
    },

    selectStartTime: function(e) {
        selectTime.call(this, e.target, 'start_time', 'visTimeStart')
    },

    selectEndTime: function(e) {
        selectTime.call(this, e.target, 'end_time', 'visTimeEnd')
    },

    render: function() {
        var eventData = this.state.eventData
        return (
            <div className={'event-form' + (this.state.visible ? '' : ' none')}>
                <form id='event-form' onSubmit={this.handleSubmit}>
                    <div className='title-form'>Create event</div>
                    <label className='title-event'>
                        Title event*
                        <input type='text' name='title' ref='title'
                            value={eventData.title} onChange={this.handleChange} />
                    </label>

                    <div className='category'>
                        <span>Event category*</span>
                        <label>
                            <input name='category' ref='home' type='radio' value='home'
                                checked={eventData.category === 'home'} onChange={this.handleChange} />
                            Home
                        </label>
                        <label>
                            <input name='category' ref='work' type='radio' value='work'
                                checked={eventData.category === 'work'} onChange={this.handleChange} />
                            Work
                        </label>
                    </div>

                    <div className='start'>
                        <label>
                            Start*
                            <input type='text' name='start_date' ref='start_date'
                                value={eventData.start_date} readOnly />
                            <i className='fa fa-chevron-down' aria-hidden='true'
                                onClick={this.changeVisible} />
                        </label>
                        <label>
                            <input type='text' name='start_time' ref='start_time'
                                value={eventData ? viewTime(eventData.start_time) : ''} readOnly />
                            <i className='fa fa-chevron-down' aria-hidden='true'
                                onClick={this.changeVisible} />
                        </label>
                    </div>

                    <div className={'select-date' + (this.state.visCalendarStart ? '' : ' none')}
                        onClick={this.selectStartDate}>
                        <CalendarWidget day={new Date(eventData.start_date)} period='day' />
                    </div>
                    <div className={'select-time' + (this.state.visTimeStart ? '' : ' none')}
                        onClick={this.selectStartTime}>
                        <SelectTime />
                    </div>

                    <div className='end'>
                        <label>
                            End*
                            <input type='text' name='end_date' ref='end_date'
                                value={eventData.end_date} readOnly />
                            <i className='fa fa-chevron-down' aria-hidden='true'
                                onClick={this.changeVisible} />
                        </label>
                        <label>
                            <input type='text' name='end_time' ref='end_time'
                                value={eventData ? viewTime(eventData.end_time) : ''} readOnly />
                            <i className='fa fa-chevron-down' aria-hidden='true'
                                onClick={this.changeVisible} />
                        </label>
                    </div>

                    <div className={'select-date' + (this.state.visCalendarEnd ? '' : ' none')}
                        onClick={this.selectEndDate}>
                        <CalendarWidget day={new Date(eventData.start_date)} period='day' />
                    </div>
                    <div className={'select-time' + (this.state.visTimeEnd ? '' : ' none')}
                        onClick={this.selectEndTime}>
                        <SelectTime />
                    </div>

                    <label className='place'>
                        Place
                        <input type='text' name='place' ref='place'
                            value={eventData.place}
                            onChange={this.handleChange} />
                    </label>

                    <label className='discription'>
                        Discription
                        <textarea name='discription' ref='discription'
                            value={eventData.discription}
                            onChange={this.handleChange}></textarea>
                    </label>
                    <div className='button-block'>
                        <button type='submit' className='button'>Save</button>
                        <button type='reset' className='button'>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
});

function selectDate(target, changeState, visState) {
    if (target.className.includes('curr-month')
        || target.className.includes('other-month')) {
        let state = this.state;
        state.eventData[changeState] = new Date(+target.id).toLocaleString('en-US').split(',')[0];
        state[visState] = false;
        this.setState(state);
    };
}

function selectTime(target, changeState, visState) {
    if (target.className === 'time') {
        let state = this.state;
        state.eventData[changeState] = target.getAttribute('data-time');
        state[visState] = false;
        this.setState(state);
    };
}

function viewTime(time) {
    var options = {hour: '2-digit', minute: '2-digit'};
    return new Date(+time).toLocaleTimeString('en-US', options).toLowerCase();
}

export {CreateEvent};
