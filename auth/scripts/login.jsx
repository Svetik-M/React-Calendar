'use strict'

import React from 'react';
import ReactDOM from 'react-dom';

import Valid from './validation.js';


var Login = React.createClass({
    getInitialState: function() {
        return {
            valid: false,
            mesEmail: '',
            mesPassword: ''
        }
    },

    componentDidMount: function() {
        ReactDOM.findDOMNode(this.refs.login).focus();
    },

    render: function() {
        return (
            <div id='login'>
                <h2>Welcome Back!</h2>

                <form action="/login" method="post">

                    <div className='field-wrap'>
                        <label>
                            <i className='fa fa-user' aria-hidden='true' />
                            <input type='email' name='username' ref='login'
                                   className={'login' + (this.state.mesEmail ? ' error' : '')}
                                   onBlur={Valid.validLogin.bind(this)}
                                   onChange={Valid.validation.bind(this)}
                                   defaultValue='' placeholder='E-mail Address' />
                        </label>
                        <div className='err'>
                            {this.state.mesEmail}
                        </div>
                    </div>

                    <div className='field-wrap'>
                        <label>
                            <i className='fa fa-lock' aria-hidden='true' />
                            <input type='password' name='password' ref='password'
                                   className={'password' + (this.state.mesPassword ? ' error' : '')}
                                   onBlur={Valid.validPass.bind(this)}
                                   onChange={Valid.validation.bind(this)}
                                   defaultValue='' placeholder='Password' />
                        </label>
                        <div>
                            <div className='message'>
                                Password must be 7-15 characters, including letters and numbers
                            </div>
                            <div className='err'>{this.state.mesPassword}</div>
                        </div>
                    </div>
                    <div className='error-message'>

                    </div>

                    <button type='submit' className={this.state.valid ? 'button' : ' button-block'}
                            disabled={!this.state.valid} formNoValidate>
                        Log In
                    </button>

                </form>

            </div>
        );
    }
});

export {Login};
