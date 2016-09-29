'use strict'


import React from 'react';
import { Link } from 'react-router';

import Login from './login.jsx';
import Signup from './signup.jsx';
import Error from '../components/error.jsx';


const AuthorizationForm = React.createClass({
    getInitialState: function () {
        return {
            formType: this.props.params.form,
            visible: false
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            formType: nextProps.params.form,
            visible: false
        });
    },

    getSignup: function() {
        this.setState({
            formType: 'signup',
            visible: true
        });
    },

    getLogin: function() {
        this.setState({
            formType: 'login',
            visible: true
        });
    },

    changeVisible: function() {
        this.setState( function(previousState) {
            return {
                formType: previousState.formType,
                visible: false
            };
        });

    },

    changeVisError: function(e) {
        let state = this.state;

        if (e && e.target.className === 'fa fa-times') {
            state.visError = false;
        } else {
            state.visError = true;
        }

        this.setState(state);
    },

    render: function() {
        let menu, errorMassage, form;

        if (this.state.formType === 'login') {
            menu = (<ul className='form-group'>
                        <li className='form'><Link to='/signup'>Sign Up</Link></li>
                        <li className='form active'>Log In</li>
                    </ul>);
            errorMassage = 'Incorrect E-mail Address or Password';
            form = <Login scope={this}/>;

        } else if (this.state.formType === 'signup') {
            menu = (<ul className='form-group'>
                        <li className='form active'>Sign Up</li>
                        <li className='form'><Link className='link' to='/login'>Log In</Link></li>
                    </ul>);
            errorMassage = 'User already exists, please Log in';
            form = <Signup scope={this} />;
        }

        return (
            <div className='authorization'>
                <div className='logo'>My Calendar</div>
                <div className='reg-form'>
                    {menu}
                    {form}
                </div>
                <div className={'incorrect' + (this.state.visible ? '' : ' none')}>
                    <div>
                        <i className='fa fa-times' aria-hidden='true' onClick={this.changeVisible} />
                        <div>
                            <i className='fa fa-exclamation-triangle' aria-hidden='true' />
                            {errorMassage}
                        </div>
                    </div>
                </div>
                <div onClick={this.changeVisError}>
                    <Error visible={this.state.visError} />
                </div>
            </div>
        );
    }
});


export default AuthorizationForm;
