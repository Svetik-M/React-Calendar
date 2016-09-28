'use strict'


import React from 'react';

import {getEventDate} from '../get-events.js';


const FullEvent = React.createClass({

    render: function() {
        let ev = this.props.selEvent;

        if (ev) {
            let evDateStr = getEventDate(ev);

            return (
                <div className='full-event'>
                    <p>Selected event</p>
                    <div className={this.props.visible ? undefined : 'none'}>
                        <div className='event-body'>
                            <p>{ev.title}</p>
                            <p><span>Category: </span>{ev.category}</p>
                            <p>{evDateStr}</p>
                            <p><span>{ev.place !== '' ? 'Place: ' : ''}</span>{ev.place}</p>
                            <p><span>{ev.discription !== '' ? 'Discription: ' : ''}</span>{ev.discription}</p>
                        </div>
                        <div className='button-block'>
                            <button type='button' className='button delete'>Delete</button>
                            <button type='button' data-event={ev.id} className='button edit'>Edit Event</button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='full-event'>
                    <p>Selected event</p>
                    <div className={this.props.visible ? undefined : 'none'}></div>
                </div>
            );
        }

    }
});


export default FullEvent;
