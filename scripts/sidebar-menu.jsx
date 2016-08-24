'use strict'

import React from 'react';
import {CalendarWidget} from './calendar-widget.jsx'

export var SidebarMenu = React.createClass({
    render: function() {
        return (
            <div className="sidebar-menu">
                <div className="create-event"><i className="fa fa-plus-circle" aria-hidden="true"></i> Create event</div>
                <CalendarWidget />
            </div>
        );
    }
});
