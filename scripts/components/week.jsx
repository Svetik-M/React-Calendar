import React from 'react';

import Event from './event';
import { sortWeekEventsByDays, sortDayEventsByHour, sortEvForCountMaxLength } from '../get-events';
import { getStartDateStrAndCoefWidth } from '../viewing-options';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;

function getNewState(props) {
  const firstDateOfWeekMS = props.selDate.getTime() - props.selDate.getDay() * MS_IN_DAY;
  const eventsByDays = sortWeekEventsByDays(props.events, firstDateOfWeekMS);

  const eventsByHours = eventsByDays.map((val, ind) => {
    const dateMidnightMS = firstDateOfWeekMS + ind * MS_IN_DAY;
    return sortDayEventsByHour(val, dateMidnightMS);
  });

  const arrOfEvents = eventsByDays.map((val, ind) => {
    const dateMidnightMS = firstDateOfWeekMS + ind * MS_IN_DAY;
    return sortEvForCountMaxLength(val, dateMidnightMS);
  });

  const arrMaxLen = arrOfEvents.map((val) => {
    const arrLen = val.map(v => v.length);
    return Math.max.apply(null, arrLen);
  });

  return { events: eventsByHours, maxLen: arrMaxLen };
}

const IventsOfWeek = React.createClass({
  getInitialState() {
    return {
      events: new Array(7),
    };
  },

  componentWillReceiveProps(nextProps) {
    const state = getNewState(nextProps);
    this.setState(state);
  },

  componentWillMount() {
    const state = getNewState(this.props);
    this.setState(state);
  },

  render() {
    const { selDate } = this.props;
    const DOWSelDate = selDate.getDay();
    const firstDateOfWeekMS = selDate.getTime() - DOWSelDate * MS_IN_DAY;
    let { events } = this.state;
    const tableTitle = [];
    const tableRows = [];
    let timeStr;

    for (let i = 0; i < 7; i += 1) {
      const day = new Date(firstDateOfWeekMS + i * MS_IN_DAY).getDate();
      const month = +(new Date(firstDateOfWeekMS + i * MS_IN_DAY).getMonth()) + 1;

      tableTitle.push((
        <td key={i} className="events-group">
          {`${DAYS_OF_WEEK[i]} ${day}/${month}`}
        </td>
      ));
    }

    events = events.map((value, index) => {
      const dateMidnightMS = firstDateOfWeekMS + index * MS_IN_DAY;

      const arrDayEvents = value.map((val) => {
        if (val === undefined) {
          return val;
        }
        const arrTimeEvents = val.map((item) => {
          const params = getStartDateStrAndCoefWidth(item, index, dateMidnightMS);

          if (params === undefined) return undefined;

          return (<Event
            key={item.id}
            events={this.props.events}
            currEvent={item}
            startDateStr={params.startDateStr}
            period="week"
            dateMidnightMS={dateMidnightMS}
            coefWidth={params.coefWidth}
          />);
        }, this);

        return arrTimeEvents;
      }, this);

      return arrDayEvents;
    }, this);

    for (let index = 0; index < 25; index += 1) {
      const eventsByDOW = [];
      const d = new Date();
      const todayMS = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

      if (index === 1) timeStr = '12am';
      else if (index < 13) timeStr = `${index - 1}am`;
      else if (index === 13) timeStr = '12pm';
      else if (index > 13) timeStr = `${index - 13}pm`;

      for (let i = 0; i < 7; i += 1) {
        const bool = firstDateOfWeekMS + i * MS_IN_DAY === todayMS;

        if (index === 0) {
          const tdStyle = {
            height: `calc(${events[i][0].length * 20}px + ${
              events[i][0].length * 2 + 6}px)`,
          };

          eventsByDOW.push((
            <td
              key={i}
              className={bool ? 'events-group today all-day' : 'events-group all-day'}
              style={tdStyle}
            >
              {events[i][0]}
            </td>
          ));
        } else {
          const divStyle = { width: `calc(100% - ${7 * (this.state.maxLen[i] - 1)}px)` };

          eventsByDOW.push((
            <td key={i} className={bool ? 'events-group today' : 'events-group'}>
              <div
                key={i + 0.0}
                className="half"
                data-date={firstDateOfWeekMS + i * MS_IN_DAY + index * MS_IN_HOUR}
              >
                <div style={divStyle}>
                  {events[i][2 * index - 1]}
                </div>
              </div>
              <div
                key={i + 0.1}
                className="half"
                data-date={firstDateOfWeekMS + i * MS_IN_DAY + i * MS_IN_HOUR + MS_IN_HOUR / 2}
              >
                <div style={divStyle}>
                  {events[i][2 * index]}
                </div>
              </div>
            </td>
          ));
        }
      }

      if (index === 0) {
        tableRows.push((
          <tr key={index}>
            <td className="time all-day">All Day</td>
            {eventsByDOW}
          </tr>
        ));
      } else {
        tableRows.push((
          <tr key={index}>
            <td className="time">{timeStr}</td>
            {eventsByDOW}
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
        <table className="events-list week">
          {/* }<thead>
                        <tr>
                            <td className='time'></td>
                            {tableTitle}
                        </tr>
                    </thead> */}
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  },
});

export default IventsOfWeek;
