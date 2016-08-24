'use strict'

import React from 'react';

var monthNames = ['January', 'February', 'March', 'April',
                  'May', 'June', 'July', 'August',
                  'September', 'October', 'November', 'December'],
    date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
    period = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();

export var Period = React.createClass({
    render: function(){
        return <div className='selected-period'>{period}</div>
    }
});
