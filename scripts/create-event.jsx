'use strict'

import React from 'react';
import ReactDOM from 'react-dom';

import requests from './request.js';
import validation from './validation.js';
import {CalendarWidget} from './calendar-widget.jsx';


const MS_IN_HOUR = 3600000,
      MS_IN_MIN = 60000;
var date = new Date(),
    timeZone = date.getTimezoneOffset()*MS_IN_MIN,
    optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'};


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
            return <div key={i} className='time' data-time={i * MS_IN_HOUR/2}>{timeStr}</div>
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
        var state = setState(this.props);
        return state;
    },

    componentWillReceiveProps: function(nextProps) {
        var state;
        if (nextProps.visible === true) {
            state = setState(nextProps);
        } else {
            state = this.state;
            state.visible = false;
        }
        this.setState(state);
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
        var valid = validation.validForm.call(this);
        if (valid === false) {
            let state = this.state;
            state.visible = true;
            this.setState(state);
        } else {
            let eventData = this.state.eventData,
                form = Object.assign({}, eventData);

            form.start_date = new Date(new Date(eventData.start_date).getTime() + (+this.state.start_time));
            form.end_date = new Date(new Date(eventData.end_date).getTime() + (+this.state.end_time));

            requests.sendEventForm.call(this.props.scope, form, this.state.id);
        }
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
        var eventData = this.state.eventData;

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

                    <div className='date-time'>
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
                                    value={eventData ? viewTime(this.state.start_time) : ''} readOnly />
                                <i className='fa fa-chevron-down' aria-hidden='true'
                                    onClick={this.changeVisible} />
                            </label>
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
                                    value={eventData ? viewTime(this.state.end_time) : ''} readOnly />
                                <i className='fa fa-chevron-down' aria-hidden='true'
                                    onClick={this.changeVisible} />
                            </label>
                        </div>
                    </div>

                    <div className={'select-start-date' + (this.state.visCalendarStart ? '' : ' none')}
                        onClick={this.selectStartDate}>
                        <CalendarWidget day={new Date(eventData.start_date)} period='day' />
                    </div>
                    <div className={'select-start-time' + (this.state.visTimeStart ? '' : ' none')}
                        onClick={this.selectStartTime}>
                        <SelectTime />
                    </div>

                    <div className={'select-end-date' + (this.state.visCalendarEnd ? '' : ' none')}
                        onClick={this.selectEndDate}>
                        <CalendarWidget day={new Date(eventData.start_date)} period='day' />
                    </div>
                    <div className={'select-end-time' + (this.state.visTimeEnd ? '' : ' none')}
                        onClick={this.selectEndTime}>
                        <SelectTime />
                    </div>

                    {/*<div>
                        <label className='repeat'>
                            Repeat
                            <input name='repeat' ref='repeat' type='checkbox' value='repeat'
                                onChange={this.handleChange}></input>
                        </label>
                    </div>*/}

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

                    <div className='error'>
                        <div className={'err' + (this.state.invalid ? '' : ' none')}>
                            <i className='fa fa-exclamation-triangle' aria-hidden='true' />
                            {this.state.invalid}
                        </div>
                    </div>

                    <div className='button-block'>
                        <button type='submit' className='button'>Save</button>
                        <button type='reset' className='button'>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
});

function setState(props) {
    var ev = props.editableEvent,
        startDate = ev ? new Date(ev.start_date).toLocaleString('en-US', optionsDate)
                       : date.toLocaleString('en-US', optionsDate),
        endDate = ev ? new Date(ev.end_date).toLocaleString('en-US', optionsDate)
                       : date.toLocaleString('en-US', optionsDate);

    return {
        visible: props.visible,
        id: ev ? ev.id : undefined,
        eventData: {
            title: ev ? ev.title : '',
            start_date: startDate,
            end_date: endDate,
            place: ev ? ev.place : '',
            category: ev ? ev.category : '',
            discription: ev ? ev.discription : ''
        },
        start_time: ev ? ev.start_date - new Date(startDate).getTime() : '',
        end_time: ev ? ev.end_date - new Date(endDate).getTime() : '',
        invalid: ''
    };
}

function selectDate(target, changeState, visState) {
    if (target.className.includes('curr-month')
        || target.className.includes('other-month')) {
        let state = this.state;
        state.eventData[changeState] = new Date(+target.id).toLocaleString('en-US', optionsDate);
        state[visState] = false;
        this.setState(state);
    };
}

function selectTime(target, changeState, visState) {
    if (target.className === 'time') {
        let state = this.state;
        state[changeState] = target.getAttribute('data-time');
        state[visState] = false;
        this.setState(state);
    };
}

function viewTime(time) {
    var options = {hour: '2-digit', minute: '2-digit'};
    return new Date(+time + timeZone).toLocaleTimeString('en-US', options).toLowerCase().replace(' ', '');
}

export {CreateEvent};
