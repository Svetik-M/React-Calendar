'use strict'

import React from 'react';
import requests from './request.js';

var CreateEvent = React.createClass({
    getInitialState: function() {
        return {
            visible: this.props.visible
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({visible: nextProps.visible});
    },

    handleSubmit: function(e) {
        e.preventDefault();
        requests.sendEventForm.call(this);
    },

    render: function() {
        return (
            <div className={'event-form' + (this.state.visible ? '' : ' none')}>
                <form id='event-form' onSubmit={this.handleSubmit}>
                    <div className='title-form'>Create event</div>
                    <label className='title-event'>
                        Title event*
                        <input type='text' ref='title' defaultValue='' required />
                    </label>
                    <label className='start'>
                        Start*
                        <input type='date' ref='start_date' defaultValue='' required />
                        <input type='time' ref='start_time' defaultValue='' required />
                    </label>
                    <label className='end'>
                        End*
                        <input type='date' ref='end_date' defaultValue='' required />
                        <input type='time' ref='end_time' defaultValue='' required />
                    </label>
                    <label className='place'>
                        Place
                        <input type='text' ref='place' defaultValue='' />
                    </label>

                    <div className='category'>
                        <span>Event category*</span>
                        <label><input name='category' ref='home' type='radio' value='home' required/> Home</label>
                        <label><input name='category' ref='work' type='radio' value='work' required/> Work</label>
                    </div>
                    <label className='discription'>
                        Discription
                        <textarea ref='discription'></textarea>
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
