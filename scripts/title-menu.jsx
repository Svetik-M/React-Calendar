'use strict'

import React from 'react';
import {Period} from './selected-period.jsx'

export var TitleMenu  = React.createClass({
    render: function() {
        return (
            <div className='header'>
                <div className="logo">My Calendar</div>
                <div className="menu">
                    <div className="title-menu">
                        <div className="nav-today">Today</div>
                        <div className="nav">
                            <div><i className="fa fa-arrow-circle-left" aria-hidden="true"></i></div>
                            <Period />
                            <div><i className="fa fa-arrow-circle-right" aria-hidden="true"></i></div>
                        </div>
                        <ul className="period-block">
                            <li className="period day">Day</li>
                            <li className="period week">Week</li>
                            <li className="period month">Month</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});
