'use strict'

import React from 'react';
import {CalendarWidget} from './calendar-widget.jsx';
import {CreateEvent} from './create-event.jsx';

var SidebarMenu = React.createClass({
    getInitialState: function() {
        return {
            visible: false
        };
    },

    visualizeForm: function() {
        this.setState({visible: true});
    },

    hidingForm: function(event) {
        var target = event.target;
        if (target.className === 'button') {
            this.setState({visible: false});
        }
    },

    render: function() {
        return (
            <div className='sidebar-menu'>
                <div className='create-event' onClick={this.visualizeForm}>
                    <i className='fa fa-plus-circle' aria-hidden='true'></i>
                    <span> Create event</span>
                 </div>
                <CalendarWidget day={this.props.day} period={this.props.period} />
                <div onClick={this.hidingForm}>
                    <CreateEvent visible={this.state.visible} />
                </div>
            </div>
        );
    }
});


export {SidebarMenu};
