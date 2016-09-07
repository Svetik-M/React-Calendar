'use strict'

import React from 'react';

import {IventsOfDay} from './day.jsx';
import {IventsOfWeek} from './week.jsx';
import {IventsOfMonth} from './month.jsx';

var EventsTable = React.createClass({
    render: function() {
        if (this.props.period === 'day') {
            return <IventsOfDay day={this.props.day} />;
        } else if (this.props.period === 'week') {
            return <IventsOfWeek day={this.props.day} />;
        } else if (this.props.period === 'month') {
            return <IventsOfMonth day={this.props.day} />;
        }
    }
});

export {EventsTable};
