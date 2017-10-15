import React from 'react';

import IventsOfDay from './day';
import IventsOfWeek from './week';
import IventsOfMonth from './month';
import CreateEvent from './create-event';
import FullEvent from './full-event';
import Error from './error';

import { getThisEvents, sortEvents, getEventDate } from '../get-events';
import requests from '../requests';

const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;
const MS_IN_MIN = 60000;

let todayEvents = [];

function filterEvents() {
  const dateMS = new Date().getTime();

  const eventsForNotif = todayEvents.filter((value) => {
    const startNotifMS = value.startDate - 5 * MS_IN_MIN;
    return startNotifMS > dateMS && startNotifMS < dateMS + 2000;
  });

  return eventsForNotif;
}


function createNotification(arrEvents) {
  for (let i = 0; i < arrEvents.length; i += 1) {
    todayEvents = todayEvents.filter(value => value.id !== arrEvents[i].id);

    const audio = new Audio();
    audio.src = 'sounds/reminder.wav';
    audio.autoplay = true;

    const evDateStr = getEventDate(arrEvents[i]);
    const options = {
      body: `${evDateStr}\n${arrEvents[i].title}`,
      icon: 'images/reminder.png',
    };
    // eslint-disable-next-line
    new Notification('Reminder', options);
  }
}

function getNotification() {
  const eventsForNotif = filterEvents();
  if (eventsForNotif !== []) createNotification(eventsForNotif);
}

const EventsTable = React.createClass({
  getInitialState() {
    return {
      events: [],
      eventId: '',
      visEventForm: this.props.visEventForm,
      visFullEvent: false,
      visError: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    const { state } = this;
    state.visEventForm = nextProps.visEventForm;
    getThisEvents.call(this, state, nextProps);
  },

  componentWillMount() {
    getThisEvents.call(this);

    const start = new Date().getTime();
    const end = start + MS_IN_DAY + MS_IN_HOUR;
    setInterval(requests.getDayEvents.call(this, start, end), MS_IN_DAY);
  },

  getArrOfEvents(res, startMS, endMS) {
    const arrSort = sortEvents(res, startMS, endMS);
    const { state } = this;

    state.events = arrSort;
    this.setState(state);
  },

  updateEvents() {
    const start = new Date().getTime();
    const end = start + MS_IN_DAY + MS_IN_HOUR;
    getThisEvents.call(this);
    requests.getDayEvents.call(this, start, end);
  },

  getArrOfDayEvents(res, start, end) {
    const arrSort = sortEvents(res, start, end);
    todayEvents = arrSort;
  },

  clearForm(e) {
    const { target } = e;
    if (target.className === 'button create') {
      const { state } = this;
      state.eventId = '';
      this.setState(state);
    }
  },

  changeFullEvent(e) {
    const { target } = e;

    if (target.className === 'button edit') {
      const { state } = this;

      state.visEventForm = true;
      state.visFullEvent = false;
      state.eventId = target.getAttribute('data-event');
      this.setState(state);
    } else if (target.className === 'button delete') {
      requests.deletEvent.call(this, this.state.selEvent.id);

      const { state } = this;
      state.visFullEvent = false;
      this.setState(state);
    }
  },

  viewFullEvent(e) {
    const { target } = e;
    const { state } = this;

    if (target.className.indexOf('event ') >= 0) {
      const id = target.id.replace(/-\d*/, '');
      const startDateMS = +target.getAttribute('data-start');
      const selEvent = this.state.events.filter(v => v.id === id && v.startDate === startDateMS)[0];

      if (this.state.selEvent
            && this.state.selEvent.id === id
            && this.state.selEvent.startDate === startDateMS) {
        state.visFullEvent = !this.state.visFullEvent;
      } else {
        state.visFullEvent = true;
      }

      state.selEvent = selEvent;
    } else {
      state.visFullEvent = false;
    }

    this.setState(state);
  },

  changeVisError(e) {
    const { state } = this;

    if (e && e.target.className === 'fa fa-times') {
      state.visError = false;
    } else {
      state.visError = true;
    }

    this.setState(state);
  },

  componentDidMount() {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setInterval(getNotification, 1000);
        }
      });
    }
  },

  render() {
    let body;
    if (this.props.period === 'day') {
      body = <IventsOfDay selDate={this.props.selDate} events={this.state.events} scope={this} />;
    } else if (this.props.period === 'week') {
      body = <IventsOfWeek selDate={this.props.selDate} events={this.state.events} scope={this} />;
    } else if (this.props.period === 'month') {
      body = (<IventsOfMonth
        selDate={this.props.selDate}
        startDateMS={this.state.startDateMS}
        lastDateOfMonthMS={this.state.lastDateOfMonthMS}
        events={this.state.events}
        scope={this}
      />);
    }

    let editableEvent;
    const { eventId } = this.state;
    if (this.state.eventId !== '') {
      [editableEvent] = this.state.events.filter(value => value.id === eventId);
    }

    return (
      <div>
        <div className="main-block" onClick={this.viewFullEvent}>
          {body}
        </div>
        <div onClick={this.clearForm}>
          <CreateEvent
            visible={this.state.visEventForm}
            scope={this}
            editableEvent={editableEvent}
          />
        </div>
        <div onClick={this.changeFullEvent}>
          <FullEvent
            visible={this.state.visFullEvent}
            scope={this}
            selEvent={this.state.selEvent}
          />
        </div>
        <div onClick={this.changeVisError}>
          <Error visible={this.state.visError} />
        </div>
      </div>
    );
  },
});

export default EventsTable;
