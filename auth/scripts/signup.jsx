'use strict'

import React from 'react';
import ReactDOM from 'react-dom';

import Valid from './validation.js';


var Signup = React.createClass({
    getInitialState: function() {
        return {
            mesFirstN: '',
            mesLastN: '',
            mesEmail: '',
            mesPassword: ''
        }
    },

    componentDidMount: function() {
        ReactDOM.findDOMNode(this.refs.first_name).focus();
    },

    render: function() {
        return (
            <div id='signup'>
                <h2>Sign Up for Free</h2>

                <form action="/signup" method="post">
                    <div className='top-row'>
                        <input type='text' name='first_name' ref='first_name'
                               className={'first_name' + (this.state.mesFirstN ? ' error' : '')}
                               onBlur={Valid.validFirstName.bind(this)}
                               onChange={Valid.validation.bind(this)}
                               defaultValue='' placeholder='First Name*' />
                           <input type='text' name='last_name' ref='last_name'
                               className={'last_name' + (this.state.mesLastN ? ' error' : '')}
                               onBlur={Valid.validLastName.bind(this)}
                               onChange={Valid.validation.bind(this)}
                               defaultValue='' placeholder='Last Name*' />
                        <div className='err'>
                            {this.state.mesFirstN}
                        </div>
                        <div className='err'>
                            {this.state.mesLastN}
                        </div>
                    </div>

                    <div className='main'>
                        <input type='email' name='username' ref='login'
                               className={'login' + (this.state.mesEmail ? ' error' : '')}
                               onBlur={Valid.validLogin.bind(this)}
                               onChange={Valid.validation.bind(this)}
                               defaultValue=''placeholder='E-mail Address*' />
                        <div className='err'>
                            {this.state.mesEmail}
                        </div>
                    </div>

                    <div className='main'>
                        <input type='password' name='password' ref='password'
                               className={'password' + (this.state.mesPassword ? ' error' : '')}
                               onBlur={Valid.validPass.bind(this)}
                               onChange={Valid.validation.bind(this)}
                               defaultValue='' placeholder='Set A Password*' />
                        <div>
                            <div className='message'>
                                Password must be 7-15 characters, including letters and numbers
                            </div>
                            <div className='err'>{this.state.mesPassword}</div>
                        </div>
                    </div>

                    <div className='error-message'>
                        {this.state.mesСapture}
                    </div>

                    <button type='submit' className={this.state.valid ? 'button' : ' button-block'}
                            disabled={!this.state.valid} formNoValidate>
                        Get Started
                    </button>

                </form>

            </div>
        );
    }
});

export {Signup};
