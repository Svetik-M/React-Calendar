'use strict'

import React from 'react';
import requests from './request.js';

var Event = React.createClass({
    deletEvent: function() {
        requests.deletEvent.call(this.props.scope, this.props.event.id);
    },

    isVisible: function(e) {
        var elem = document.querySelector('.events-block .vis');
        if (elem) elem.className = 'full-event none';
        e.target.nextElementSibling.className = 'full-event vis';

    },

    noVisible: function(e) {
        e.target.parentElement.className = 'full-event none';
    },

    render: function() {
        var ev = this.props.event;
        return (
            <div>
                <div id={ev.id} className={'category ' + ev.category} onClick={this.isVisible}>
                    {this.props.start + ' ' + ev.title}
                </div>
                <div className={'full-event none'}>
                    <i className='fa fa-times' aria-hidden='true' onClick={this.noVisible} />
                    <div>
                        <p>{ev.title}</p>
                        <p>{'Category: ' + ev.category}</p>
                        <p>{new Date(ev.start_date).toLocaleDateString() + ' ' + ev.start_time.slice(0, -3) + ' - '
                            + new Date(ev.end_date).toLocaleDateString() + ' ' + ev.end_time.slice(0, -3)}</p>
                        <p>{ev.place !== '' ? 'Place: ' + ev.place : ''}</p>
                        <p>{ev.discription !== '' ? 'Discription: ' + ev.discription : ''}</p>
                    </div>
                    <div className='button-block'>
                        <button type='button' className='button' onClick={this.deletEvent}>Delete</button>
                        <button type='button' data-event={ev.id} className='button edit'>Edit Event</button> {/*клик обрабатывается в app.jsx*/}
                    </div>
                </div>
            </div>

        )
    }
});


export {Event};
