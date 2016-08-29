'use strict'

import React from 'react';

var Login = React.createClass({
    render: function() {
        return (
        <div id='login'>
            <h2>Welcome Back!</h2>

            <form action='/' method='post'>

                <div className='field-wrap'>
                    <label><i className='fa fa-user' aria-hidden='true'></i></label>
                    <input type='email' ref='login' defaultValue='' placeholder='E-mail Address' required/>
                </div>

                <div className='field-wrap'>
                    <label><i className='fa fa-lock' aria-hidden='true'></i></label>
                    <input type='password' ref='password' defaultValue='' placeholder='Password' required/>
                </div>

                <button className='button button-block'>Log In</button>

            </form>

        </div>
        );
    }
});

var Signup = React.createClass({
    render: function() {
        return (
            <div id='signup'>
                <h2>Sign Up for Free</h2>

                <form action='/' method='post'>
                    <div className='top-row'>
                        <input type='text' ref='first-name' defaultValue='' placeholder='First Name*' required/>
                        <input type='text' ref='last-name' defaultValue='' placeholder='Last Name*' required/>
                    </div>

                    <div className='main'>
                        <input type='email' ref='email' defaultValue='' placeholder='E-mail Address*' required/>
                        <input type='password' ref='set-password' defaultValue='' placeholder='Set A Password*' required/>
                    </div>

                    <button type='submit' className='button button-block'>Get Started</button>

                </form>

            </div>
        );
    }
});

var AuthorizationForm = React.createClass({
    getInitialState: function () {
        return {
            formType: 'log in'
        };
    },

    getSignup: function() {
        this.setState({formType: 'sign up'})
    },

    getLogin: function() {
        this.setState({formType: 'log in'})
    },

    render: function() {
        if (this.state.formType === 'log in') {
            return (
                <div className='authorization'>
                    <div className='logo'>My Calendar</div>
                    <div className='reg-form'>
                        <ul className='form-group'>
                            <li className='form' onClick={this.getSignup}>Sign Up</li>
                            <li className='form active'>Log In</li>
                        </ul>
                        <Login />
                    </div>
                </div>
            );
        } else {
            return (
                <div className='authorization'>
                    <div className='logo'>My Calendar</div>
                    <div className='reg-form'>
                        <ul className='form-group'>
                            <li className='form active'>Sign Up</li>
                            <li className='form' onClick={this.getLogin}>Log In</li>
                        </ul>
                        <Signup />
                    </div>
                </div>
            );
        }
    }
});


export {AuthorizationForm};
