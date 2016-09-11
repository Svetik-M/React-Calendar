'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import Valid from './validation.js';
import {Login} from './login.jsx';
import {Signup} from './signup.jsx';

import '../styles/style.scss';

var AuthorizationForm = React.createClass({
    getInitialState: function () {
        return {
            formType: this.props.params.form,
            visible: this.props.params.name === 'incorrect'
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            formType: nextProps.params.form,
            visible: nextProps.params.name === 'incorrect'
        })
    },

    getSignup: function() {
        this.setState({
            formType: 'sign up',
            visible: this.props.params.name === 'incorrect'
        })
    },

    getLogin: function() {
        this.setState({
            formType: 'log in',
            visible: this.props.params.name === 'incorrect'
        })
    },

    changeVisible: function() {
        this.setState( function(previousState) {
            return {
                formType: previousState.formType,
                visible: false
            };
        });

    },

    render: function() {
        if (this.state.formType === 'login') {
            return (
                <div className='authorization'>
                    <div className='logo'>My Calendar</div>
                    <div className='reg-form'>
                        <ul className='form-group'>
                            <li className='form'><Link to='/signup'>Sign Up</Link></li>
                            <li className='form active'>Log In</li>
                        </ul>
                        <Login/>
                    </div>
                    <div className={'incorrect' + (this.state.visible ? '' : ' none')}>
                        <div>
                            <i className='fa fa-times' aria-hidden='true' onClick={this.changeVisible} />
                            <div>
                                <i className='fa fa-exclamation-triangle' aria-hidden='true' />
                                Incorrect E-mail Address or Password
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (this.state.formType === 'signup'){
            return (
                <div className='authorization'>
                    <div className='logo'>My Calendar</div>
                    <div className='reg-form'>
                        <ul className='form-group'>
                            <li className='form active'>Sign Up</li>
                            <li className='form'><Link className='link' to='/login'>Log In</Link></li>
                        </ul>
                        <Signup />
                    </div>
                    <div className={'incorrect' + (this.state.visible ? '' : ' none')}>
                        <div>
                            <i className='fa fa-times' aria-hidden='true' onClick={this.changeVisible}></i>
                            <div>
                                <i className='fa fa-exclamation-triangle' aria-hidden='true' />
                                User already exists, please Log in
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
});

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path='/:form' component={AuthorizationForm} />
        <Route path='/:form/:name' component={AuthorizationForm} />
    </Router>,
    document.getElementById('cont')
);
//export {AuthorizationForm};
