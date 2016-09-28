'use strict'


import React from 'react';

import CalendarWidget from './calendar-widget.jsx';


const SidebarMenu = React.createClass({
    render: function() {
        return (
            <div className='sidebar-menu'>
                <div className='create-event'>
                    <i className='fa fa-plus-circle' aria-hidden='true'></i>
                    <span> Create event</span>
                 </div>
                <CalendarWidget selDate={this.props.selDate} period={this.props.period} />
            </div>
        );
    }
});


export default SidebarMenu;
