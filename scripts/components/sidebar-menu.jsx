'use strict'


import React from 'react';

import CalendarWidget from './calendar-widget.jsx';


const SidebarMenu = React.createClass({
    render: function() {
        return (
            <div className='sidebar-menu'>
                <div className='create-event'>
                    <button><i className='fa fa-plus-circle' aria-hidden='true' /> Create event</button>
                </div>
                <CalendarWidget selDate={this.props.selDate} period={this.props.period} />
            </div>
        );
    }
});


export default SidebarMenu;
