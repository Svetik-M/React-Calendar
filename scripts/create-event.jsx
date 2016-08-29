'use strict'

import React from 'react';

var CreateEvent = React.createClass({
    getInitialState: function() {
        return {
            visible: this.props.visible
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({visible: nextProps.visible});
    },

    render: function() {
        return (
            <div className={'event-form' + (this.state.visible ? '' : ' none')}>
                <form action='/event' method='post'>
                    <div className='title-form'>Create event</div>
                    <label className='title-event'>
                        Title event
                        <input type='text' ref='title-event' defaultValue='' />
                    </label>
                    <label className='start'>
                        Start
                        <input type='date' ref='start-date' defaultValue='' />
                        <input type='time' ref='start-time' defaultValue='' />
                    </label>
                    <label className='end'>
                        End
                        <input type='date' ref='end-date' defaultValue='' />
                        <input type='time' ref='end-time' defaultValue='' />
                    </label>
                    <label className='place'>
                        Place
                        <input type='text' ref='place' defaultValue='' />
                    </label>

                    <div className='category'>
                        <span>Event category</span>
                        <label><input name='category' type='radio' value='home' /> Home</label>
                        <label><input name='category' type='radio' value='work' /> Work</label>
                    </div>
                    <label className='discription'>
                        Discription
                        <textarea></textarea>
                    </label>
                    <div className='button-block'>
                        <button type='submit' className='button button-blocked'>Save</button>
                        <button type='reset' className='button'>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
});

export {CreateEvent};
