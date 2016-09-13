'use strict'

import React from 'react';
import requests from './request.js';

var CreateEvent = React.createClass({
    getInitialState: function() {
        var ev = this.props.editableEvent;
        return {
            visible: this.props.visible,
            id: ev ? ev.id : undefined,
            eventData: {
                title: ev ? ev.title : '',
                start_date: ev ? new Date(ev.start_date).toISOString().slice(0, 10) : '',
                start_time: ev ? ev.start_time.slice(0, -3) : '',
                end_date: ev ? new Date(ev.end_date).toISOString().slice(0, 10) : '',
                end_time: ev ? ev.end_time.slice(0, -3) : '',
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
                start_date: ev ? new Date(ev.start_date).toISOString().slice(0, 10) : '',
                start_time: ev ? ev.start_time.slice(0, -3) : '',
                end_date: ev ? new Date(ev.end_date).toISOString().slice(0, 10) : '',
                end_time: ev ? ev.end_time.slice(0, -3) : '',
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
        console.log(state);
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var form = this.state.eventData;
        console.log(form);
        requests.sendEventForm.call(this.props.scope, form, this.state.id);
    },

    render: function() {
        return (
            <div className={'event-form' + (this.state.visible ? '' : ' none')}>
                <form id='event-form' onSubmit={this.handleSubmit}>
                    <div className='title-form'>Create event</div>
                    <label className='title-event'>
                        Title event*
                        <input type='text' name='title' ref='title'
                            value={this.state.eventData.title}
                            onChange={this.handleChange} />
                    </label>
                    <label className='start'>
                        Start*
                        <input type='date' name='start_date' ref='start_date'
                            value={this.state.eventData.start_date}
                            onChange={this.handleChange} />
                        <input type='time' name='start_time' ref='start_time'
                            value={this.state.eventData.start_time}
                            onChange={this.handleChange} />
                    </label>
                    <label className='end'>
                        End*
                        <input type='date' name='end_date' ref='end_date'
                            value={this.state.eventData.end_date}
                            onChange={this.handleChange} />
                        <input type='time' name='end_time' ref='end_time'
                            value={this.state.eventData.end_time}
                            onChange={this.handleChange} />
                    </label>
                    <label className='place'>
                        Place
                        <input type='text' name='place' ref='place'
                            value={this.state.eventData.place}
                            onChange={this.handleChange} />
                    </label>

                    <div className='category'>
                        <span>Event category*</span>
                        <label>
                            <input name='category' ref='home' type='radio' value='home'
                                checked={this.state.eventData.category === 'home'}
                                onChange={this.handleChange} />
                            Home
                        </label>
                        <label>
                            <input name='category' ref='work' type='radio' value='work'
                                checked={this.state.eventData.category === 'work'}
                                onChange={this.handleChange} />
                            Work
                        </label>
                    </div>
                    <label className='discription'>
                        Discription
                        <textarea name='discription' ref='discription'
                            value={this.state.eventData.discription}
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

export {CreateEvent};
