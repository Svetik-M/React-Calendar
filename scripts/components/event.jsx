'use strict'


import React from 'react';

import {getElementPosition} from '../viewing-options.js';


const Event = React.createClass({
    getInitialState: function() {
        return {
            heightEl: 0,
            leftEl: 0,
            topEl: 0
        };
    },

    componentWillMount: function() {
        let state = getElementPosition(this.props);
        this.setState(state);
    },

    componentWillReceiveProps: function(nextProps) {
        let state = getElementPosition(nextProps);
        this.setState(state);
    },

    render: function() {
        let ev = this.props.currEvent,
            divStyle;

        if (this.state.heightEl > 0) {
            divStyle = {
                height: this.state.heightEl + 'px',
                left: this.state.leftEl + 'px'
            }
        } else {
            divStyle = {
                height: 20 + 'px',
                left: this.state.leftEl + 'px'
            }
        }

        if (this.props.coefWidth) {
            let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime(),
                coef = this.props.coefWidth === 2 || this.props.coefWidth === 3 ? -1 :
                       this.props.coefWidth === 4 ? 1 : 0;

            coef += (this.props.coefWidth-1)*4.5 + 4 - 6;
            divStyle.width = 'calc(' + this.props.coefWidth*100  + '%' + ' + ' + coef + 'px)';

            if (this.state.topEl) divStyle.top = this.state.topEl + 'px';
        } 

        return (
            <div>
                <div id={ev.id + '-' + this.props.dateMidnightMS} className={'event ' + ev.category}
                    data-start={ev.start_date} style={divStyle}>
                    {this.props.startDateStr + ' ' + ev.title}
                </div>
            </div>

        )
    }
});


export default Event;
