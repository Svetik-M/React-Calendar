'use strict'

import React from 'react';
import requests from './request.js';


const MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000;


var Event = React.createClass({
    getInitialState: function() {
        return {
            heightEl: 0,
            leftEl: 0
        };
    },

    componentWillMount: function() {
        if (this.props.currEvent.start_date >= this.props.midnight + MS_IN_DAY
        || this.props.currEvent.end_date <= this.props.midnight) {return}

        if (this.props.scope.props.period === 'day' || this.props.scope.props.period === 'week') {
            if (!(this.props.currEvent.start_date <= this.props.midnight
            && this.props.currEvent.end_date >= this.props.midnight + MS_IN_DAY)) {
                getElementHeight.call(this, this.props);
                getElementLeftShift.call(this, this.props);
            }
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.currEvent.start_date >= nextProps.midnight + MS_IN_DAY
        || nextProps.currEvent.end_date <= nextProps.midnight) {return}

        if (nextProps.scope.props.period === 'day' || nextProps.scope.props.period === 'week') {
            if (!(nextProps.currEvent.start_date <= nextProps.midnight
            && nextProps.currEvent.end_date >= nextProps.midnight + MS_IN_DAY)) {
                getElementHeight.call(this, nextProps);
                getElementLeftShift.call(this, nextProps);
            }
        }
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
                height: this.state.heightEl + 1.2 + 'rem',
                left: this.state.leftEl + 'px'
            }
        }

        return (
            <div>
                <div id={ev.id} className={'event ' + ev.category} onClick={this.isVisible}
                    style={divStyle}>
                    {this.props.start + ' ' + ev.title}
                </div>
                <div className={'full-event none'}>
                    <i className='fa fa-times' aria-hidden='true' onClick={this.noVisible} />
                    <div>
                        <p>{ev.title}</p>
                        <p>{'Category: ' + ev.category}</p>
                        <p>{date}</p>
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



function getCoords(elem) {
  var box = elem.getBoundingClientRect();

  return {
    left: box.left + pageXOffset,
    right: box.right + pageXOffset
  };
}


function getElementHeight(props) {
    var ev = props.currEvent,
        midnight = props.midnight,
        heightRow = 26, // 24px высота строки и по 1px верхняя и нижняя границы
        heightEl = 0;

    if (ev.start_date < midnight) {
        heightEl = (ev.end_date - midnight) / MS_IN_HOUR * 2 * heightRow - 6; // по 3 px на внутренние отступы
    } else if (ev.end_date > midnight + MS_IN_DAY) {
        heightEl = (midnight + MS_IN_DAY - ev.start_date) / MS_IN_HOUR * 2 * heightRow - 6;
    } else {
        heightEl = (ev.end_date - ev.start_date) / MS_IN_HOUR * 2 * heightRow - 6;
    }

    var state = this.state;
    state.heightEl = heightEl;
    this.setState(state);
}


function getElementLeftShift(props) {
    var ev = props.currEvent,
        midnight = props.midnight,
        leftEl = 0;

    var prevEvents = props.events.filter(function(val, ind) {
        return val.start_date < ev.start_date
            && val.end_date > ev.start_date
            && (val.start_date >= midnight || val.end_date < midnight + MS_IN_DAY);
    }, this);

    var elem = prevEvents[prevEvents.length - 1];
    if (elem) {
        if (ev.start_date >= midnight || ev.end_date < midnight + MS_IN_DAY) {
            let coordsStart = getCoords(document.querySelector('.events-group')),
                coordsEl = getCoords(document.getElementById(elem.id));
            leftEl = coordsEl.left - coordsStart.left + 5;
        }
    }

    var state = this.state;
    state.leftEl = leftEl;
    this.setState(state);
}


export {Event};
