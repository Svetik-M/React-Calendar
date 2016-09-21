'use strict'

import React from 'react';
import ReactDOM from 'react-dom';

import requests from './request.js';
import validation from './validation.js';
import {CalendarWidget} from './calendar-widget.jsx';


const MS_IN_HOUR = 3600000,
      MS_IN_MIN = 60000,
      MS_IN_DAY = 86400000;

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
            state = this.state;
        state.eventData[ target.name] = target.value;
        this.setState(state);
    },

    changeIsRepeatable: function(e) {
        var state = this.state;
        state.eventData.repeat = state.eventData.repeat ? '' : 'repeat';
        this.setState(state);
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var valid = validation.validForm.call(this);

        if (valid === false) {
            let state = this.state;
            state.visible = true;
            this.setState(state);
            return;
        } else {
            let eventData = this.state.eventData,
                form = Object.assign({}, eventData);

            form.start_date = new Date(new Date(eventData.start_date).getTime() + (+this.state.start_time));
            form.end_date = new Date(new Date(eventData.end_date).getTime() + (+this.state.end_time));

            if (eventData.repeat = 'repeat') {
                let duration = this.state.repeat_duration,
                    start = eventData.start_date,
                    repEndDate;

                function repl(match) { return +match + 1; }

                if (duration === 'to date') {
                    repEndDate = new Date(eventData.repeat_end).getTime();
                } else if (duration === 'one week') {
                    repEndDate =  new Date(start).getTime() + MS_IN_DAY * 7;
                } else if (duration === 'one month') {
                    repEndDate = new Date(start.replace(start.slice(0,2), repl)).getTime();
                } else if (duration === 'one year') {
                    repEndDate = new Date(start.replace(start.slice(-4), repl)).getTime();
                }

                form.repeat_end = new Date(repEndDate + (+this.state.start_time));
            }

            requests.sendEventForm.call(this.props.scope, form, this.state.id);
        }
    },

    changeVisible: function(e) {
        e.stopPropagation();
        var target = e.target,
            elem = target.previousElementSibling,
            state = Object.assign({}, this.state);

        elem.focus();

        state.vis = {};
        state.vis[elem.name] = (!this.state.vis[elem.name])
        this.setState(state);
    },

    selectStartDate: function(e) {
        e.stopPropagation();
        selectDate.call(this, e.target, 'start_date', 'startDate');
    },

    selectEndDate: function(e) {
        e.stopPropagation();
        selectDate.call(this, e.target, 'end_date', 'endDate');
    },

    selectTime: function(e) {
        e.stopPropagation();
        var target = e.target;
        if (target.className === 'time') {
            let state = this.state,
                changeState = target.parentElement.parentElement.className.slice(7),
                visState = changeState === 'start_time' ? 'startTime' : 'endTime';

            state[changeState] = target.getAttribute('data-time');
            state.vis[visState] = false;
            this.setState(state);
        };
    },

    selectRepeatOptions: function(e) {
        e.stopPropagation();
        var target = e.target;
        if (target.className === 'options') {
            let state = this.state,
                changeState = target.parentElement.className.slice(7),
                visState = changeState === 'repeat_rate' ? 'repRate' : 'repDuration';

            if (changeState === 'repeat_rate') {
                state.eventData[changeState] = target.getAttribute('data-option');
            } else {
                state[changeState] = target.getAttribute('data-option')
            }

            state.vis[visState] = false;
            this.setState(state);
        };
    },

    selectRepeatEnd: function(e) {
        e.stopPropagation();
        selectDate.call(this, e.target, 'repeat_end', 'repEnd');
    },

    hidden: function(e) {
        var state = this.state;
        state.vis = {};
        this.setState(state);
    },

    render: function() {
        var eventData = this.state.eventData;

        return (
            <div className={'event-form' + (this.state.visible ? '' : ' none')} onClick={this.hidden}>
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
                                <input type='text' name='startDate' ref='start_date'
                                    value={eventData.start_date} readOnly onClick={e => e.stopPropagation()}/>
                                <i className='fa fa-chevron-down' aria-hidden='true'
                                    onClick={this.changeVisible} />
                            </label>
                            <label>
                                <input type='text' name='startTime' ref='start_time'
                                    value={eventData ? viewTime(this.state.start_time) : ''} readOnly
                                    onClick={e => e.stopPropagation()} />
                                <i className='fa fa-chevron-down' aria-hidden='true'
                                    onClick={this.changeVisible} />
                            </label>
                        </div>

                        <div className='end'>
                            <label>
                                End*
                                <input type='text' name='endDate' ref='end_date'
                                    value={eventData.end_date} readOnly onClick={e => e.stopPropagation()} />
                                <i className='fa fa-chevron-down' aria-hidden='true'
                                    onClick={this.changeVisible} />
                            </label>
                            <label>
                                <input type='text' name='endTime' ref='end_time'
                                    value={eventData ? viewTime(this.state.end_time) : ''} readOnly
                                    onClick={e => e.stopPropagation()} />
                                <i className='fa fa-chevron-down' aria-hidden='true'
                                    onClick={this.changeVisible} />
                            </label>
                        </div>
                    </div>

                    <div className={'select_start_date' + (this.state.vis.startDate ? '' : ' none')}
                        onClick={this.selectStartDate}>
                        <CalendarWidget day={new Date(eventData.start_date)} period='day' />
                    </div>
                    <div className={'select_start_time' + (this.state.vis.startTime ? '' : ' none')}
                        onClick={this.selectTime}>
                        <SelectTime />
                    </div>

                    <div className={'select_end_date' + (this.state.vis.endDate ? '' : ' none')}
                        onClick={this.selectEndDate}>
                        <CalendarWidget day={new Date(eventData.end_date)} period='day' />
                    </div>
                    <div className={'select_end_time' + (this.state.vis.endTime ? '' : ' none')}
                        onClick={this.selectTime}>
                        <SelectTime />
                    </div>



                    <div className='repeat'>
                        <span>Repeat</span>
                        <input type='checkbox' name='repeat' ref='repeat' value='repeat'
                            checked={eventData.repeat === 'repeat'} onChange={this.changeIsRepeatable}>
                        </input>
                        <div className={'rep-rate' + (eventData.repeat ? '' : ' none')}>
                            <input type='text' name='repRate' ref='repeat_rate'
                                value={eventData.repeat_rate} readOnly />
                            <i className='fa fa-chevron-down' aria-hidden='true'
                                onClick={this.changeVisible} />
                        </div>
                        <div className={'rep-duration' + (eventData.repeat ? '' : ' none')}>
                            <input type='text' name='repDuration' ref='repeat_duration'
                                value={this.state.repeat_duration} readOnly />
                            <i className='fa fa-chevron-down' aria-hidden='true'
                                onClick={this.changeVisible} />
                        </div>
                        <div className={'rep-end' + (this.state.repeat_duration === 'to date' ? '' : ' none')}>
                            <input type='text' name='repEnd' ref='repeat_end'
                                value={eventData.repeat_end} readOnly />
                            <i className='fa fa-chevron-down' aria-hidden='true'
                                onClick={this.changeVisible} />
                        </div>
                    </div>

                    <div className={'select_repeat_rate' + (this.state.vis.repRate ? '' : ' none')}
                        onClick={this.selectRepeatOptions}>
                        <div className='options' data-option='every day'>every day</div>
                        <div className='options' data-option='every week'>every week</div>
                        <div className='options' data-option='every month'>every month</div>
                    </div>

                    <div className={'select_repeat_duration' + (this.state.vis.repDuration ? '' : ' none')}
                        onClick={this.selectRepeatOptions}>
                        <div className='options' data-option='one week'>one week</div>
                        <div className='options' data-option='one month'>one month</div>
                        <div className='options' data-option='one year'>one year</div>
                        <div className='options' data-option='to date'>to date</div>
                    </div>

                    <div className={'select_repeat_end' + (this.state.vis.repEnd ? '' : ' none')}
                        onClick={this.selectRepeatEnd}>
                        <CalendarWidget day={new Date(eventData.repeat_end)} period='day' />
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

                    <div className='error'>
                        <div className={'err' + (this.state.invalid ? '' : ' none')}>
                            <i className='fa fa-exclamation-triangle' aria-hidden='true' />
                            {this.state.invalid}
                        </div>
                    </div>

                    <div className='button-block'>
                        <button type='submit' className='create button'>Save</button>
                        <button type='reset' className='create button'>Cancel</button>
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
                       : date.toLocaleString('en-US', optionsDate),
        repeatEnd = ev && ev.repeat_end ? new Date(ev.repeat_rate).toLocaleString('en-US', optionsDate)
                       : new Date(date.getTime() + 6 * MS_IN_DAY).toLocaleString('en-US', optionsDate);

    return {
        visible: props.visible,
        id: ev ? ev.id : undefined,
        vis: {},
        eventData: {
            title: ev ? ev.title : '',
            start_date: startDate,
            end_date: endDate,
            place: ev ? ev.place : '',
            category: ev ? ev.category : '',
            discription: ev ? ev.discription : '',
            repeat: ev ? ev.is_repeat : '',
            repeat_rate: ev && ev.repeat_rate ? ev.repeat_rate : 'every day',
            repeat_end: repeatEnd
        },
        start_time: ev ? ev.start_date - new Date(startDate).getTime() : '',
        end_time: ev ? ev.end_date - new Date(endDate).getTime() : '',
        repeat_duration: ev && ev.repeat_duration ? ev.repeat_duration : 'one week',
        invalid: ''
    };
}

function selectDate(target, changeState, visState) {
    if (target.className.includes('curr-month')
        || target.className.includes('other-month')) {
        let state = this.state;
        state.eventData[changeState] = new Date(+target.id).toLocaleString('en-US', optionsDate);
        state.vis[visState] = false;
        this.setState(state);
    };
}

function viewTime(time) {
    var options = {hour: '2-digit', minute: '2-digit'};
    return new Date(+time + timeZone).toLocaleTimeString('en-US', options).toLowerCase().replace(' ', '');
}


export {CreateEvent};
