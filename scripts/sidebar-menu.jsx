'use strict'

import React from 'react';
import {CalendarWidget} from './calendar-widget.jsx';
import {CreateEvent} from './create-event.jsx';

var SidebarMenu = React.createClass({
    getInitialState: function() {
        return {
            visible: this.props.visible,
            action: this.props.action
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            visible: nextProps.visible,
            action: nextProps.action
        });
    },

    visualizeForm: function() {
        this.setState({
            visible: true,
            action: 'add'
        });
    },

    hidingForm: function(event) {
        var target = event.target;
        if (target.className === 'button') {
            this.setState({
                visible: false,
                action: this.props.action
            });
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
                {/*<div onClick={this.hidingForm}>
                    <CreateEvent  action={this.state.action} visible={this.state.visible} />
                </div>*/}
            </div>
        );
    }
});


export {SidebarMenu};
