'use strict'


import React from 'react';


const FullEvent = React.createClass({

    render: function() {
        let ev = this.props.currEvent;

        if (ev) {
            let optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'},
                optionsTime = {hour: '2-digit', minute: '2-digit'},
                optionsDateTime = Object.assign({}, optionsDate, optionsTime),
                date;

            if (new Date(ev.start_date).toLocaleDateString() === new Date(ev.end_date).toLocaleDateString()) {
                date = new Date(ev.start_date).toLocaleString('en-US', optionsDateTime).replace('0 ', '0')
                    + ' - ' + new Date(ev.end_date).toLocaleString('en-US', optionsTime).replace('0 ', '0');
            } else {
                date = new Date(ev.start_date).toLocaleString('en-US', optionsDateTime).replace('0 ', '0')
                    + ' - ' + new Date(ev.end_date).toLocaleString('en-US', optionsDateTime).replace('0 ', '0');
            }

            return (
                <div className='full-event'>
                    <p>Selected event</p>
                    <div className={this.props.visible ? undefined : 'none'}>
                        <div className='event-body'>
                            <p>{ev.title}</p>
                            <p><span>Category: </span>{ev.category}</p>
                            <p>{date}</p>
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
