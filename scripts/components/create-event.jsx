import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CalendarWidget from './calendar-widget';

import requests from '../requests';
import validation from '../validation';
import { getDateStr, getTimeStr } from '../viewing-options';

const MS_IN_HOUR = 3600000;
const MS_IN_MIN = 60000;
const MS_IN_DAY = 86400000;

const date = new Date();
const timeZone = date.getTimezoneOffset() * MS_IN_MIN;

function setState(props) {
  const ev = props.editableEvent;
  const start = ev ? new Date(ev.startDate) : date;
  const end = ev ? new Date(ev.endDate) : date;
  const repeat = ev && ev.repeatEnd
    ? new Date(ev.repeat_rate)
    : new Date(date.getTime() + 6 * MS_IN_DAY);
  const startDate = getDateStr(start);
  const endDate = getDateStr(end);
  const repeatEnd = getDateStr(repeat);

  return {
    visible: props.visible,
    id: ev ? ev.id : undefined,
    vis: {},
    eventData: {
      title: ev ? ev.title : '',
      startDate,
      endDate,
      place: ev ? ev.place : '',
      category: ev ? ev.category : '',
      description: ev ? ev.description : '',
      repeat: ev ? ev.is_repeat : '',
      repeat_rate: ev && ev.repeat_rate ? ev.repeat_rate : 'every day',
      repeatEnd,
    },
    start_time: ev ? ev.startDate - new Date(startDate).getTime() : '',
    end_time: ev ? ev.endDate - new Date(endDate).getTime() : '',
    repeat_duration: ev && ev.repeat_duration ? ev.repeat_duration : 'one week',
    invalid: '',
  };
}

function selectDate(target, changeState, visState) {
  if (target.className.indexOf('curr-month') >= 0
        || target.className.indexOf('other-month') >= 0) {
    const { state } = this;
    const selDate = new Date(+target.id);

    state.eventData[changeState] = getDateStr(selDate);
    state.vis[visState] = false;
    this.setState(state);
  }
}

function viewTime(time) {
  const selTime = new Date(+time + timeZone);
  const timeStr = getTimeStr(selTime);

  return timeStr;
}

function SelectTime() {
  const options = [];
  let timeStr;

  for (let i = 0; i < 48; i += 1) {
    const minutes = (i % 2 === 0 ? '00' : '30');
    const a = Math.floor(i / 2);

    if (a === 0) timeStr = `12:${minutes}am`;
    else if (a < 12) timeStr = `${a}:${minutes}am`;
    else if (a === 12) timeStr = `12:${minutes}pm`;
    else if (a > 12) timeStr = `${a - 12}:${minutes}pm`;

    options.push(<div key={i} className="time" data-time={i * MS_IN_HOUR / 2}>{timeStr}</div>);
  }

  return (
    <div>
      {options}
    </div>
  );
}

class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      classNone: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.changeIsRepeatable = this.changeIsRepeatable.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeVisible = this.changeVisible.bind(this);
    this.selectStartDate = this.selectStartDate.bind(this);
    this.selectEndDate = this.selectEndDate.bind(this);
    this.selectTime = this.selectTime.bind(this);
    this.selectRepeatOptions = this.selectRepeatOptions.bind(this);
    this.selectRepeatEnd = this.selectRepeatEnd.bind(this);
    this.hidden = this.hidden.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let newState;

    if (nextProps.visible === true) {
      newState = setState(nextProps);
    } else {
      newState = this.state;
      newState.visible = false;
    }

    newState.classNone = {};
    this.setState(newState);
  }

  handleChange(e) {
    const { target } = e;
    const { state } = this;
    state.eventData[target.name] = target.value;
    this.setState(state);
  }

  changeIsRepeatable() {
    const { state } = this;
    state.eventData.repeat = state.eventData.repeat ? '' : 'repeat';
    this.setState(state);
  }

  handleSubmit(e) {
    e.preventDefault();
    const valid = validation.validEventForm.call(this);

    if (valid === false) {
      const { state } = this;
      state.visible = true;
      this.setState(state);
      return;
    }
    const { eventData } = this.state;
    const form = JSON.parse(JSON.stringify(eventData));

    form.startDate = new Date(new Date(eventData.startDate).getTime() + (+this.state.start_time));
    form.endDate = new Date(new Date(eventData.endDate).getTime() + (+this.state.end_time));

    if (eventData.repeat === 'repeat') {
      const duration = this.state.repeat_duration;
      const start = eventData.startDate;
      let repEndDate;

      const repl = match => +match + 1;

      if (duration === 'to date') {
        repEndDate = new Date(eventData.repeatEnd).getTime();
      } else if (duration === 'one week') {
        repEndDate = new Date(start).getTime() + MS_IN_DAY * 6;
      } else if (duration === 'one month') {
        repEndDate = new Date(start.replace(start.slice(0, 2), repl)).getTime();
      } else if (duration === 'one year') {
        repEndDate = new Date(start.replace(start.slice(-4), repl)).getTime();
      }

      form.repeatEnd = new Date(repEndDate + (+this.state.start_time));
    } else {
      form.repeat_rate = undefined;
      form.repeatEnd = undefined;
    }

    requests.sendEventForm.call(this.props.scope, form, this.state.id);
  }

  changeVisible(e) {
    e.stopPropagation();
    const { target } = e;
    const elem = target.previousElementSibling;
    const state = JSON.parse(JSON.stringify(this.state));

    elem.focus();

    state.vis = {};
    state.vis[elem.name] = (!this.state.vis[elem.name]);
    state.classNone[elem.name] = true;
    this.setState(state);

    if (elem.name === 'startDate' || elem.name === 'endDate') {
      const className = `.select_${elem.name.replace('Date', '_date')}`;
      const height = document.querySelector(`${className} .nav-date`).offsetHeight;
      document.querySelector(className).style.setProperty('--nav-date-height', `${height}px`);
    }
  }

  selectStartDate(e) {
    e.stopPropagation();
    selectDate.call(this, e.target, 'startDate', 'startDate');
  }

  selectEndDate(e) {
    e.stopPropagation();
    selectDate.call(this, e.target, 'endDate', 'endDate');
  }

  selectTime(e) {
    e.stopPropagation();
    const { target } = e;
    if (target.className === 'time') {
      const { state } = this;
      const changeState = target.parentElement.parentElement.className.slice(7);
      const visState = changeState === 'start_time' ? 'startTime' : 'endTime';

      state[changeState] = target.getAttribute('data-time');
      state.vis[visState] = false;
      this.setState(state);
    }
  }

  selectRepeatOptions(e) {
    e.stopPropagation();
    const { target } = e;
    if (target.className === 'options') {
      const { state } = this;
      const changeState = target.parentElement.className.slice(7);
      const visState = changeState === 'repeat_rate' ? 'repRate' : 'repDuration';

      if (changeState === 'repeat_rate') {
        state.eventData[changeState] = target.getAttribute('data-option');
      } else {
        state[changeState] = target.getAttribute('data-option');
      }

      state.vis[visState] = false;
      this.setState(state);
    }
  }

  selectRepeatEnd(e) {
    e.stopPropagation();
    selectDate.call(this, e.target, 'repeatEnd', 'repEnd');
  }

  hidden() {
    const { state } = this;
    state.vis = {};
    this.setState(state);
  }

  render() {
    const { eventData } = this.state;

    return (
      <div className={`event-form${this.state.visible ? '' : ' none'}`} onClick={this.hidden}>
        <form id="event-form" onSubmit={this.handleSubmit}>
          <div className="title-form">Create event</div>
          <label className="title-event">
            Title event*
            <input
              type="text"
              name="title"
              ref={(el) => { this.title = el; }}
              value={eventData.title}
              onChange={this.handleChange}
            />
          </label>

          <div className="category">
            <span>Event category*</span>
            <label>
              <input
                name="category"
                ref={(el) => { this.home = el; }}
                type="radio"
                value="home"
                checked={eventData.category === 'home'}
                onChange={this.handleChange}
              />
              Home
            </label>
            <label>
              <input
                name="category"
                ref={(el) => { this.work = el; }}
                type="radio"
                value="work"
                checked={eventData.category === 'work'}
                onChange={this.handleChange}
              />
              Work
            </label>
          </div>

          <div className="date-time">
            <div className="start">
              <label>
                Start*
                <input
                  type="text"
                  name="startDate"
                  ref={(el) => { this.startDate = el; }}
                  value={eventData.startDate}
                  readOnly
                  onClick={e => e.stopPropagation()}
                />
                <i
                  className="fa fa-chevron-down"
                  aria-hidden="true"
                  onClick={this.changeVisible}
                />
              </label>
              <label>
                <input
                  type="text"
                  name="startTime"
                  ref={(el) => { this.start_time = el; }}
                  value={eventData ? viewTime(this.state.start_time) : ''}
                  readOnly
                  onClick={e => e.stopPropagation()}
                />
                <i
                  className="fa fa-chevron-down"
                  aria-hidden="true"
                  onClick={this.changeVisible}
                />
              </label>
            </div>

            <div className="end">
              <label>
                End*
                <input
                  type="text"
                  name="endDate"
                  ref={(el) => { this.endDate = el; }}
                  value={eventData.endDate}
                  readOnly
                  onClick={e => e.stopPropagation()}
                />
                <i
                  className="fa fa-chevron-down"
                  aria-hidden="true"
                  onClick={this.changeVisible}
                />
              </label>
              <label>
                <input
                  type="text"
                  name="endTime"
                  ref={(el) => { this.end_time = el; }}
                  value={eventData ? viewTime(this.state.end_time) : ''}
                  readOnly
                  onClick={e => e.stopPropagation()}
                />
                <i
                  className="fa fa-chevron-down"
                  aria-hidden="true"
                  onClick={this.changeVisible}
                />
              </label>
            </div>
          </div>

          <div
            className={`select_startDate${this.state.classNone.startDate ? '' : ' hidden'}`}
            data-vis={(!this.state.classNone.startDate) ? 'none'
              : (this.state.vis.startDate) && 'show-date' || 'hidden-date'}
            onClick={this.selectStartDate}
          >
            <CalendarWidget selDate={new Date(eventData.startDate)} period="day" />
          </div>
          <div
            className={`select_start_time${this.state.classNone.startTime ? '' : ' hidden'}`}
            data-vis={(!this.state.classNone.startTime) ? 'none'
              : (this.state.vis.startTime) && 'show-time' || 'hidden-time'}
            onClick={this.selectTime}
          >
            <SelectTime />
          </div>

          <div
            className={`select_endDate${this.state.classNone.endDate ? '' : ' hidden'}`}
            data-vis={(!this.state.classNone.endDate) ? 'none'
              : (this.state.vis.endDate) && 'show-date' || 'hidden-date'}
            onClick={this.selectEndDate}
          >
            <CalendarWidget selDate={new Date(eventData.endDate)} period="day" />
          </div>
          <div
            className={`select_end_time${this.state.classNone.endTime ? '' : ' hidden'}`}
            data-vis={(!this.state.classNone.endTime) ? 'none'
              : (this.state.vis.endTime) && 'show-time' || 'hidden-time'}
            onClick={this.selectTime}
          >
            <SelectTime />
          </div>

          <div className="repeat">
            <span>Repeat</span>
            <input
              type="checkbox"
              name="repeat"
              ref={(el) => { this.repeat = el; }}
              value="repeat"
              checked={eventData.repeat === 'repeat'}
              onChange={this.changeIsRepeatable}
            />
            <div className={`rep-rate${eventData.repeat ? '' : ' none'}`}>
              <input
                type="text"
                name="repRate"
                ref={(el) => { this.repeat_rate = el; }}
                value={eventData.repeat_rate}
                readOnly
              />
              <i
                className="fa fa-chevron-down"
                aria-hidden="true"
                onClick={this.changeVisible}
              />
            </div>
            <div className={`rep-duration${eventData.repeat ? '' : ' none'}`}>
              <input
                type="text"
                name="repDuration"
                ref={(el) => { this.repeat_duration = el; }}
                value={this.state.repeat_duration}
                readOnly
              />
              <i
                className="fa fa-chevron-down"
                aria-hidden="true"
                onClick={this.changeVisible}
              />
            </div>
            <div className={`rep-end${this.state.repeat_duration === 'to date' ? '' : ' none'}`}>
              <input
                type="text"
                name="repEnd"
                ref={(el) => { this.repeatEnd = el; }}
                value={eventData.repeatEnd}
                readOnly
              />
              <i
                className="fa fa-chevron-down"
                aria-hidden="true"
                onClick={this.changeVisible}
              />
            </div>
          </div>

          <div
            className={`select_repeat_rate${this.state.vis.repRate ? '' : ' none'}`}
            onClick={this.selectRepeatOptions}
          >
            <div className="options" data-option="every day">every day</div>
            <div className="options" data-option="every week">every week</div>
            <div className="options" data-option="every month">every month</div>
          </div>

          <div
            className={`select_repeat_duration${this.state.vis.repDuration ? '' : ' none'}`}
            onClick={this.selectRepeatOptions}
          >
            <div className="options" data-option="one week">one week</div>
            <div className="options" data-option="one month">one month</div>
            <div className="options" data-option="one year">one year</div>
            <div className="options" data-option="to date">to date</div>
          </div>

          <div
            className={`select_repeatEnd${this.state.vis.repEnd ? '' : ' none'}`}
            onClick={this.selectRepeatEnd}
          >
            <CalendarWidget selDate={new Date(eventData.repeatEnd)} period="day" />
          </div>

          <label className="place">
              Place
              <input
                type="text"
                name="place"
                ref={(el) => { this.place = el; }}
                value={eventData.place}
                onChange={this.handleChange}
              />
          </label>

          <label className="description">
            Description
            <textarea
              name="description"
              ref={(el) => { this.description = el; }}
              value={eventData.description}
              onChange={this.handleChange}
            />
          </label>

          <div className="error">
            <div className={`err${this.state.invalid ? '' : ' none'}`}>
              <i className="fa fa-exclamation-triangle" aria-hidden="true" />
              {this.state.invalid}
            </div>
          </div>

          <div className="button-block">
            <button type="submit" className="button create">Save</button>
            <button type="reset" className="button create">Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

CreateEvent.propTypes = {
  scope: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateEvent;
