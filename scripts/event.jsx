'use strict'

import React from 'react';
import requests from './request.js';
import {getElementPosition} from './viewing-options.js'

var Event = React.createClass({
    getInitialState: function() {
        return {
            heightEl: 0,
            leftEl: 0,
            topEl: 0
        };
    },

    componentWillMount: function() {
        var state = getElementPosition(this.props);
        this.setState(state);
    },

    componentWillReceiveProps: function(nextProps) {
        var state = getElementPosition(nextProps);
        this.setState(state);
    },

    deletEvent: function() {
        requests.deletEvent.call(this.props.scope, this.props.currEvent.id);
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
        var ev = this.props.currEvent,
            optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'},
            optionsTime = {hour: '2-digit', minute: '2-digit'},
            optionsDateTime = Object.assign({}, optionsDate, optionsTime),
            date,
            divStyle;

        if (new Date(ev.start_date).toLocaleString('en-US', optionsDate)
        === new Date(ev.end_date).toLocaleString('en-US', optionsDate)) {
            date = new Date(ev.start_date).toLocaleString('en-US', optionsDateTime) + ' - '
                + new Date(ev.end_date).toLocaleString('en-US', optionsTime);
        } else {
            date = new Date(ev.start_date).toLocaleString('en-US', optionsDateTime) + ' - '
                + new Date(ev.end_date).toLocaleString('en-US', optionsDateTime)
        }

        if (this.state.heightEl) {
            divStyle = {
                height: this.state.heightEl + 'px',
                left: this.state.leftEl + 'px'
            }
        } else {
            divStyle = {
                height: 1.2 + 'rem',
                left: this.state.leftEl + 'px'
            }
        }

        if (this.props.coefWidth) {
            divStyle.width = 'calc(' + this.props.coefWidth*100 + '%' + ' + '
                            + (this.props.coefWidth * 3.5 - 5.5) + 'px)';
            if(this.state.topEl) divStyle.top = this.state.topEl + 'px';
        }

        return (
            <div>
                <div id={this.props.id ? this.props.id : ev.id} className={'event ' + ev.category}
                    onClick={this.isVisible} style={divStyle}>
                    {this.props.start + ' ' + ev.title}
                </div>
                <div className={'full-event none'}>
                    <i className='fa fa-times' aria-hidden='true' onClick={this.noVisible} />
                    <div>
                        <p>{ev.title}</p>
                        <p><span>Category: </span>{ev.category}</p>
                        <p>{date}</p>
                        <p><span>{ev.place !== '' ? 'Place: ' : ''}</span>{ev.place}</p>
                        <p><span>{ev.discription !== '' ? 'Discription: ' : ''}</span>{ev.discription}</p>
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
