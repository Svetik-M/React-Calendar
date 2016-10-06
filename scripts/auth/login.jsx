'use strict'


import React from 'react';
import ReactDOM from 'react-dom';

import validation from '../validation.js';
import request from '../requests.js';


const Login = React.createClass({
    getInitialState: function() {
        return {
            valid: false,
            mesEmail: '',
            mesPassword: ''
        }
    },

    // componentDidMount: function() {
    //     ReactDOM.findDOMNode(this.refs.login).focus();
    // },

    handleSubmit: function(e) {
        e.preventDefault();

        let form = {
            username: this.refs.login.value,
            password: this.refs.password.value
        };

        request.sendLoginForm.call(this.props.scope, form);
    },

    render: function() {
        return (
            <div id='login'>
                <h2>Welcome Back!</h2>

                <form onSubmit={this.handleSubmit}>

                    <div className='field-wrap'>
                        <label>
                            <i className='fa fa-user' aria-hidden='true' />
                            <input type='email' ref='login'
                                   className={'login' + (this.state.mesEmail ? ' error' : '')}
                                   onBlur={validation.validLogin.bind(this)}
                                   onChange={validation.validAuthForm.bind(this)}
                                   defaultValue='' placeholder='E-mail Address' />
                        </label>
                        <div className='err'>
                            {this.state.mesEmail}
                        </div>
                    </div>

                    <div className='field-wrap'>
                        <label>
                            <i className='fa fa-lock' aria-hidden='true' />
                            <input type='password' ref='password'
                                   className={'password' + (this.state.mesPassword ? ' error' : '')}
                                   onBlur={validation.validPass.bind(this)}
                                   onChange={validation.validAuthForm.bind(this)}
                                   defaultValue='' placeholder='Password' />
                        </label>
                        <div>
                            <div className='message'>
                                Password must be 7-15 characters, including letters and numbers
                            </div>
                            <div className='err'>{this.state.mesPassword}</div>
                        </div>
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


export default Login;
