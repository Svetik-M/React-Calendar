'use strict'

var validation = {

    regExpLogin: function(log) {
        log.trim();
        var regExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
        return regExp.test(log);
    },


    regExpPass: function(pass) {
        pass.trim();
        var regExp = /^[a-z0-9]{7,15}$/i;
        return pass !== '' && regExp.test(pass);
    },


    validAuthForm: function(e) {
        var state = this.state,
            login = this.refs.login.value,
            password = this.refs.password.value,
            first_name = this.refs.first_name ? this.refs.first_name.value : 'first',
            last_name = this.refs.last_name ? this.refs.last_name.value : 'last';

        if (e.target.className === 'login error' && login !== '' && validation.regExpLogin(login)) {
            state.mesEmail = '';
        } else if (e.target.className === 'password error' && password !== '' && validation.regExpPass(password)) {
            state.mesPassword = '';
        }

        state.valid = (login !== '' && password !== '' && first_name !== '' && last_name !== '' &&
            validation.regExpLogin(login) && validation.regExpPass(password));
        this.setState(state);
    },


    validLogin: function(e) {
        var state = this.state;
        if (!e.target.value) {
            state.mesEmail = 'Enter your E-mail Address';
        } else if (!validation.regExpLogin(e.target.value)) {
            state.mesEmail = 'Invalid E-mail Address!'
        } else {
            state.mesEmail = ''
        }
        this.setState(state);
    },


    validPass: function(e) {
        var state = this.state;
        if (!e.target.value) {
            state.mesPassword = 'Enter your Password';
        } else if (!validation.regExpPass(e.target.value)) {
            state.mesPassword = 'Invalid Password!'
        } else {
            state.mesPassword = ''
        }
        this.setState(state);
    },


    validFirstName: function(e) {
        let state = this.state;
        if (e.target.value === '') {
            state.mesFirstN = 'Enter your First Name';
        } else {
            state.mesFirstN = '';
        }
        this.setState(state);
    },


    validLastName: function(e) {
        let state = this.state;
        if (e.target.value === '') {
            state.mesLastN = 'Enter your Last Name';
        } else {
            state.mesLastN = '';
        }
        this.setState(state);
    },


    validTitle: function() {
        if(!this.state.eventData.title.trim()) {
            this.state.invalid = 'Please, enter the event title';
            return false;
        };

        this.state.invalid = '';
        return true;
    },


    validCategory: function() {
        if (this.state.eventData.category === '') {
            this.state.invalid = 'Please, select the event category';
            return false;
        };

        this.state.invalid = '';
        return true;
    },


    validDate: function() {
        var start = new Date(this.state.eventData.start_date).getTime() + (+this.state.start_time),
            end = new Date(this.state.eventData.end_date).getTime() + (+this.state.end_time);

        if (start > end) {
            this.state.invalid = 'The begining of the event must be no later then the and of the event';
            return false;
        };

        this.state.invalid = '';
        return true;
    },


    validEventForm: function() {
        return validation.validTitle.call(this)
               && validation.validCategory.call(this)
               && validation.validDate.call(this);
    }
};


export default validation;
