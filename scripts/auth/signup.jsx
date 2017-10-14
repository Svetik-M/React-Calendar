'use strict'

import React from 'react';
import ReactDOM from 'react-dom';

import validation from '../validation.js';
import request from '../requests.js';


const Signup = React.createClass({
    getInitialState: function() {
        return {
            mesFirstN: '',
            mesLastN: '',
            mesEmail: '',
            mesPassword: ''
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();

        let form = {
            first_name: this.refs.first_name.value,
            last_name: this.refs.last_name.value,
            username: this.refs.login.value,
            password: this.refs.password.value
        };

        request.sendSignupForm.call(this.props.scope, form);
    },

    render: function() {
        return (
            <div id='signup'>
                <h2>Sign Up for Free</h2>

                <form onSubmit={this.handleSubmit}>
                    <div className='top-row'>
                        <input type='text' ref='first_name'
                               className={'first_name' + (this.state.mesFirstN ? ' error' : '')}
                               onBlur={validation.validFirstName.bind(this)}
                               onChange={validation.validAuthForm.bind(this)}
                               defaultValue='' placeholder='First Name*' />
                           <input type='text' ref='last_name'
                               className={'last_name' + (this.state.mesLastN ? ' error' : '')}
                               onBlur={validation.validLastName.bind(this)}
                               onChange={validation.validAuthForm.bind(this)}
                               defaultValue='' placeholder='Last Name*' />
                        <div className='err'>
                            {this.state.mesFirstN}
                        </div>
                        <div className='err'>
                            {this.state.mesLastN}
                        </div>
                    </div>

                    <div className='main'>
                        <input type='email' ref='login'
                               className={'login' + (this.state.mesEmail ? ' error' : '')}
                               onBlur={validation.validLogin.bind(this)}
                               onChange={validation.validAuthForm.bind(this)}
                               defaultValue=''placeholder='E-mail Address*' />
                        <div className='err'>
                            {this.state.mesEmail}
                        </div>
                    </div>

                    <div className='main'>
                        <input type='password' ref='password'
                               className={'password' + (this.state.mesPassword ? ' error' : '')}
                               onBlur={validation.validPass.bind(this)}
                               onChange={validation.validAuthForm.bind(this)}
                               defaultValue='' placeholder='Set A Password*' />
                        <div>
                            <div className='message'>
                                Password must be 7-15 characters, including letters and numbers
                            </div>
                            <div className='err'>{this.state.mesPassword}</div>
                        </div>
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

export default Signup;
