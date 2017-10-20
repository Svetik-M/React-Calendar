import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Event from './event';

import { sortWeekEventsByDays, sortWeekEventsByDuration } from '../get-events';
import { getBlockTopShift, getStartDateStrAndCoefWidth } from '../viewing-options';


const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MS_IN_DAY = 86400000;


class Week extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: new Array(7),
    };
  }

  componentWillMount() {
    let arrOfEvents = sortWeekEventsByDays(this.props.events, this.props.firstDateOfWeekMS);
    arrOfEvents = sortWeekEventsByDuration(arrOfEvents, this.props.firstDateOfWeekMS);

    const arrTopEl = getBlockTopShift(arrOfEvents, this.props.firstDateOfWeekMS);

    this.setState({
      events: arrOfEvents,
      topEl: arrTopEl,
    });
  }

  componentWillReceiveProps(nextProps) {
    let arrOfEvents = sortWeekEventsByDays(nextProps.events, nextProps.firstDateOfWeekMS);
    arrOfEvents = sortWeekEventsByDuration(arrOfEvents, nextProps.firstDateOfWeekMS);

    const arrTopEl = getBlockTopShift(arrOfEvents, nextProps.firstDateOfWeekMS);

    this.setState({
      events: arrOfEvents,
      topEl: arrTopEl,
    });
  }

  render() {
    const firstDayOfWeekMS = this.props.firstDateOfWeekMS;
    const month = this.props.selDate.getMonth();
    const firstDateOfMonth = new Date(this.props.selDate.getFullYear(), month, 1);
    const lastDateOfMonth = new Date(this.props.selDate.getFullYear(), month + 1, 0);
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const quantityWeeks = Math.ceil((lastDateOfMonth.getDate() - 7 + firstDateOfMonth.getDay()) / 7)
      + 1;
    let { events } = this.state;
    const tableRow = [];

    events = events.map((value, index) => {
      const dateMidnightMS = firstDayOfWeekMS + index * MS_IN_DAY;

      const arrDayEvents = value.map((val) => {
        if (val === undefined) {
          return val;
        }
        const arrEvents = val.map((item) => {
          const params = getStartDateStrAndCoefWidth(item, index, dateMidnightMS);

          if (params === undefined) return undefined;

          return (<Event
            key={item.id}
            events={this.props.events}
            currEvent={item}
            startDateStr={params.startDateStr}
            period="month"
            dateMidnightMS={dateMidnightMS}
            coefWidth={params.coefWidth}
          />);
        }, this);

        return arrEvents;
      }, this);

      return arrDayEvents;
    }, this);

    for (let i = 0; i < 7; i += 1) {
      const date = new Date(firstDayOfWeekMS + i * MS_IN_DAY);
      const dateOfMonth = date.getDate();
      const dateMS = date.getTime();
      const Firefox = navigator.userAgent.indexOf('Firefox') >= 0;
      const coef = Firefox ? 2.5 : 2;
      const coefDivHeight = this.state.topEl[i] + events[i][0].filter(v => v !== undefined).length;

      const tdStyle = { height: `calc((100vh - ${5.3}rem) / ${quantityWeeks})`,
        minHeight: `${5}rem` };

      const evOneDayStyle = {
        height: `calc(100% - (${coefDivHeight * 1.2 + 1.1}rem + ${
          coefDivHeight + coef}px) - ${1}px)`,
      };

      let evSomeDaysStyle;

      if (events[i][0].length > 0 && events[i][0][0] === undefined) {
        evSomeDaysStyle = { top: `calc(${this.state.topEl[i]} * (${
          1.2}rem + ${coef}px) + ${1}px)` };
        evOneDayStyle.top = evSomeDaysStyle.top;
      }

      if (date.getMonth() !== month) {
        tableRow.push((
          <td key={i} className="other-month" data-date={dateMS} style={tdStyle}>
            <div className="date">{dateOfMonth}</div>
            <div style={evSomeDaysStyle}>{events[i][0]}</div>
            <div style={evOneDayStyle}>{events[i][1]}</div>
          </td>
        ));
      } else if (dateMS === today.getTime()) {
        tableRow.push((
          <td key={i} className="curr-month today" data-date={dateMS} style={tdStyle}>
            <div className="date">{dateOfMonth}</div>
            <div style={evSomeDaysStyle}>{events[i][0]}</div>
            <div style={evOneDayStyle}>{events[i][1]}</div>
          </td>
        ));
      } else {
        tableRow.push((
          <td key={i} className="curr-month" data-date={dateMS} style={tdStyle}>
            <div className="date">{dateOfMonth}</div>
            <div style={evSomeDaysStyle}>{events[i][0]}</div>
            <div style={evOneDayStyle}>{events[i][1]}</div>
          </td>
        ));
      }
    }

    return (
      <tr>
        {tableRow}
      </tr>
    );
  }
}

Week.propTypes = {
  events: PropTypes.array.isRequired,
  firstDateOfWeekMS: PropTypes.number.isRequired,
  selDate: PropTypes.object.isRequired,
};

function Month(props) {
  let firstDateOfWeekMS = props.startDateMS;
  const { events } = props;
  const weeks = [];

  for (let n = 1; firstDateOfWeekMS <= props.lastDateOfMonthMS;
    firstDateOfWeekMS += 7 * MS_IN_DAY, n += 1) {
    // eslint-disable-next-line
    const eventsWeek = events.filter((value) => {
      const startDate = new Date(value.startDate).getTime();
      const endDate = new Date(value.endDate).getTime();

      return startDate >= firstDateOfWeekMS
          && startDate < firstDateOfWeekMS + 7 * MS_IN_DAY
          || endDate >= firstDateOfWeekMS
          && endDate < firstDateOfWeekMS + 7 * MS_IN_DAY
          || startDate < firstDateOfWeekMS
          && endDate >= firstDateOfWeekMS + 7 * MS_IN_DAY;
    });

    weeks.push(<Week
      key={n}
      firstDateOfWeekMS={firstDateOfWeekMS}
      selDate={this.props.selDate}
      events={eventsWeek}
      scope={this.props.scope}
    />);
  }

  return (
    <tbody className="month-table">
      {weeks}
    </tbody>
  );
}

Month.propTypes = {
  startDateMS: PropTypes.number.isRequired,
  events: PropTypes.array.isRequired,
  lastDateOfMonthMS: PropTypes.number.isRequired,
};

function IventsOfMonth(props) {
  const tableTitle = [];

  for (let i = 0; i < 7; i += 1) {
    tableTitle.push((
      <td key={i} className="events-group">
        {DAYS_OF_WEEK[i]}
      </td>
    ));
  }

  return (
    <div className="events-block all-month">
      <table className="title-date">
        <tbody>
          <tr>
            {tableTitle}
          </tr>
        </tbody>
      </table>
      <table className="events-list month">
        <Month
          selDate={props.selDate}
          startDateMS={props.startDateMS}
          lastDateOfMonthMS={props.lastDateOfMonthMS}
          events={props.events}
          scope={props.scope}
        />
      </table>
    </div>
  );
}

IventsOfMonth.propTypes = {
  startDateMS: PropTypes.number.isRequired,
  events: PropTypes.array.isRequired,
  lastDateOfMonthMS: PropTypes.number.isRequired,
  selDate: PropTypes.object.isRequired,
  scope: PropTypes.object.isRequired,
};

export default IventsOfMonth;
