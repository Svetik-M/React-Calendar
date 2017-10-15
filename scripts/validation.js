const validation = {
  regExpLogin(log) {
    log.trim();
    const regExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
    return regExp.test(log);
  },

  regExpPass(pass) {
    pass.trim();
    const regExp = /^[a-z0-9]{7,15}$/i;
    return pass !== '' && regExp.test(pass);
  },

  validAuthForm(e) {
    const { state } = this;
    const login = this.refs.login.value;
    const password = this.refs.password.value;
    const firstName = this.refs.firstName ? this.refs.firstName.value : 'first';
    const lastName = this.refs.lastName ? this.refs.lastName.value : 'last';

    if (e.target.className === 'login error' && login !== '' && validation.regExpLogin(login)) {
      state.mesEmail = '';
    } else if (e.target.className === 'password error' && password !== '' && validation.regExpPass(password)) {
      state.mesPassword = '';
    }

    state.valid = (login !== '' && password !== '' && firstName !== '' && lastName !== '' &&
            validation.regExpLogin(login) && validation.regExpPass(password));
    this.setState(state);
  },

  validLogin(e) {
    const { state } = this;
    if (!e.target.value) {
      state.mesEmail = 'Enter your E-mail Address';
    } else if (!validation.regExpLogin(e.target.value)) {
      state.mesEmail = 'Invalid E-mail Address!';
    } else {
      state.mesEmail = '';
    }
    this.setState(state);
  },

  validPass(e) {
    const { state } = this;
    if (!e.target.value) {
      state.mesPassword = 'Enter your Password';
    } else if (!validation.regExpPass(e.target.value)) {
      state.mesPassword = 'Invalid Password!';
    } else {
      state.mesPassword = '';
    }
    this.setState(state);
  },

  validFirstName(e) {
    const { state } = this;
    if (e.target.value === '') {
      state.mesFirstN = 'Enter your First Name';
    } else {
      state.mesFirstN = '';
    }
    this.setState(state);
  },

  validLastName(e) {
    const { state } = this;
    if (e.target.value === '') {
      state.mesLastN = 'Enter your Last Name';
    } else {
      state.mesLastN = '';
    }
    this.setState(state);
  },

  validTitle() {
    if (!this.state.eventData.title.trim()) {
      this.state.invalid = 'Please, enter the event title';
      return false;
    }

    this.state.invalid = '';
    return true;
  },

  validCategory() {
    if (this.state.eventData.category === '') {
      this.state.invalid = 'Please, select the event category';
      return false;
    }

    this.state.invalid = '';
    return true;
  },

  validDate() {
    const startDateMS = new Date(this.state.eventData.startDate).getTime()
      + (+this.state.start_time);
    const endDateMS = new Date(this.state.eventData.endDate).getTime() + (+this.state.end_time);

    if (startDateMS > endDateMS) {
      this.state.invalid = 'The begining of the event must be no later then the and of the event';
      return false;
    }

    this.state.invalid = '';
    return true;
  },

  validEventForm() {
    return validation.validTitle.call(this)
               && validation.validCategory.call(this)
               && validation.validDate.call(this);
  },
};

export default validation;
