'use strict'

import React from 'react';
import {SelectedPeriod} from './selected-period.jsx';

export var TitleMenu  = React.createClass({
    render: function() {
        return (
            <div className='header'>
                <div className='logo'>My Calendar</div>
                <div className='menu'>
                    <div className='title-menu'>
                        <div className='nav-today' id='today'>Today</div>
                        <div className='nav'>
                            <div>
                                <i className='fa fa-arrow-circle-left' aria-hidden='true' id='prev-period' />
                            </div>
                            <SelectedPeriod day={this.props.day} period={this.props.period}/>
                            <div>
                                <i className='fa fa-arrow-circle-right' aria-hidden='true' id='next-period' />
                            </div>
                        </div>
                        <ul className='period-block'>
                            <li className='period' id='day'>Day</li>
                            <li className='period' id='week'>Week</li>
                            <li className='period' id='month'>Month</li>
                        </ul>

                    </div>
                </div>
                <div>
                    <a className='logout' href='/logout'>Log Out</a>
                </div>
            </div>
        );
    }
});
