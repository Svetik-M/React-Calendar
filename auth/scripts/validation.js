'use strict'

var Valid = {
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

    validation: function(e) {
        var state = this.state,
            login = this.refs.login.value,
            password = this.refs.password.value,
            first_name = this.refs.first_name ? this.refs.first_name.value : 'first',
            last_name = this.refs.last_name ? this.refs.last_name.value : 'last';

        if (e.target.className === 'login error' && login !== '' && Valid.regExpLogin(login)) {
            state.mesEmail = '';
        } else if (e.target.className === 'password error' && password !== '' && Valid.regExpPass(password)) {
            state.mesPassword = '';
        }

        state.valid = (login !== '' && password !== '' && first_name !== '' && last_name !== '' &&
            Valid.regExpLogin(login) && Valid.regExpPass(password));
        this.setState(state);
    },

    validLogin: function(e) {
        var state = this.state;
        if (!e.target.value) {
            state.mesEmail = 'Enter your E-mail Address';
        } else if (!Valid.regExpLogin(e.target.value)) {
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
        } else if (!Valid.regExpPass(e.target.value)) {
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
    }

};

export default Valid;
