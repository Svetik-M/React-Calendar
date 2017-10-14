'use strict'


import React from 'react';


const Error = React.createClass({
    render: function() {
        return (
            <div className={'connection-error' + (this.props.visible ? '' : ' none')}>
                <div>
                    <i className='fa fa-times' aria-hidden='true' />
                    <div>
                        <i className='fa fa-exclamation-triangle' aria-hidden='true' />
                        Internal server or database error.<br/>
                        Please try again later
                    </div>
                </div>
            </div>
        );
    }
});


export default Error;
