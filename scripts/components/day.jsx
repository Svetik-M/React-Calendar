import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Event from './event';

import { sortDayEventsByHour, sortEvForCountMaxLength } from '../get-events';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MS_IN_HOUR = 3600000;

function getNewState(props) {
  const eventsByHours = sortDayEventsByHour(props.events, props.selDate.getTime());
  const arrOfEvents = sortEvForCountMaxLength(props.events, props.selDate.getTime());
  const arrLen = arrOfEvents.map(val => val.length);
  const maxLen = Math.max.apply(null, arrLen);

  return { events: eventsByHours, maxLen };
}

class IventsOfDay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: new Array(49),
    };
  }

  componentWillMount() {
    const state = getNewState(this.props);
    this.setState(state);
  }

  componentWillReceiveProps(nextProps) {
    const state = getNewState(nextProps);
    this.setState(state);
  }

  render() {
    const { selDate } = this.props;
    const dateMidnightMS = selDate.getTime();
    const DOWSelDate = DAYS_OF_WEEK[selDate.getDay()];
    let { events } = this.state;
    const tableRows = [];
    let timeStr;

    const tableTitle = (
      <td className="events-group">
        {`${DOWSelDate} ${selDate.getDate()}/${+selDate.getMonth() + 1}`}
      </td>);

    events = events.map((value) => {
      if (value === undefined) {
        return value;
      }
      const arr = value.map((item) => {
        const startDateMS = item.startDate;
        let startDateStr;

        if (startDateMS < dateMidnightMS) {
          startDateStr = '';
        } else {
          startDateStr = new Date(startDateMS).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }).toLowerCase().replace(' ', '');
        }

        return (
          <Event
            key={item.id}
            events={this.props.events}
            currEvent={item}
            startDateStr={startDateStr}
            period="day"
            dateMidnightMS={dateMidnightMS}
          />);
      }, this);

      return arr;
    }, this);

    for (let i = 0; i < 25; i += 1) {
      if (i === 0) {
        tableRows.push((
          <tr key={i}>
            <td className="time all-day">All Day</td>
            <td className="events-group all-day">
              {events[0]}
            </td>
          </tr>
        ));
      } else {
        if (i === 1) timeStr = '12am';
        else if (i < 13) timeStr = `${i - 1}am`;
        else if (i === 13) timeStr = '12pm';
        else if (i > 13) timeStr = `${i - 13}pm`;

        const divStyle = { width: `calc(95% - ${16 * this.state.maxLen}px)` };

        tableRows.push((
          <tr key={i}>
            <td className="time">{timeStr}</td>
            <td className="events-group">
              <div className="half" data-date={dateMidnightMS + i * MS_IN_HOUR}>
                <div style={divStyle}>
                  {events[2 * i - 1]}
                </div>
              </div>
              <div className="half" data-date={dateMidnightMS + i * MS_IN_HOUR + MS_IN_HOUR / 2}>
                <div style={divStyle}>
                  {events[2 * i]}
                </div>
              </div>
            </td>
          </tr>
        ));
      }
    }

    return (
      <div className="events-block">
        <table className="title-date">
          <tbody>
            <tr>
              <td className="time" />
              {tableTitle}
            </tr>
          </tbody>
        </table>
        <table className="events-list day">
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }
}

IventsOfDay.propTypes = {
  selDate: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
};

export default IventsOfDay;
