import React from 'react';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const MS_IN_DAY = 86400000;

const Week = React.createClass({
  render() {
    const { firstDateOfWeekMS, selDate, period } = this.props;
    const daysArr = [];
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    let selPeriod = '';

    if (
      period === 'month'
      && selDate.getMonth() === this.props.viewMonth
      || period === 'week'
      && firstDateOfWeekMS <= selDate.getTime()
      && selDate.getTime() <= firstDateOfWeekMS + 6 * MS_IN_DAY
    ) {
      selPeriod = ' selectedPeriod';
    }

    for (let i = 0; i < 7; i += 1) {
      const date = new Date(firstDateOfWeekMS + i * MS_IN_DAY);
      const dayOfMonth = date.getDate();
      const dayOfMonthMs = date.getTime();
      let select = selPeriod;
      let dayElement;

      if (period === 'day' && dayOfMonthMs === selDate.getTime()) {
        select = ' selectedPeriod';
      }

      if (date.getMonth() !== this.props.viewMonth) {
        dayElement = (
          <td key={i} className={`other-month${select}`} id={dayOfMonthMs}>
            {dayOfMonth}
          </td>
        );
      } else if (dayOfMonthMs === today.getTime()) {
        dayElement = (
          <td key={i} className={`curr-month today${select}`} id={dayOfMonthMs}>
            {dayOfMonth}
          </td>
        );
      } else {
        dayElement = (
          <td key={i} className={`curr-month${select}`} id={dayOfMonthMs}>
            {dayOfMonth}
          </td>
        );
      }

      daysArr.push(dayElement);
    }

    return (
      <tr>
        {daysArr}
      </tr>
    );
  },
});


const Month = React.createClass({
  render() {
    const selDate = this.props.selDate || '';
    const period = this.props.period || '';
    const viewMonth = this.props.viewDate.getMonth();
    const viewYear = this.props.viewDate.getFullYear();
    const lastDateOfMonth = new Date(viewYear, viewMonth, new Date(viewYear, viewMonth + 1, 0)
      .getDate());
    const firstDateOfMonth = new Date(viewYear, viewMonth, 1);
    let firstDateOfWeekMS = firstDateOfMonth.getTime() - firstDateOfMonth.getDay() * MS_IN_DAY;
    const weeks = [];

    for (let n = 1; firstDateOfWeekMS <= lastDateOfMonth.getTime();
      firstDateOfWeekMS += 7 * MS_IN_DAY, n += 1) {
      weeks.push(<Week
        key={n}
        selDate={selDate}
        firstDateOfWeekMS={firstDateOfWeekMS}
        viewMonth={viewMonth}
        viewYear={viewYear}
        period={period}
      />);
    }

    return (
      <tbody className="monthTable">
        {weeks}
      </tbody>
    );
  },
});


const CalendarWidget = React.createClass({
  getInitialState() {
    return {
      selDate: this.props.selDate,
      viewDate: this.props.selDate,
      period: this.props.period,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.selDate.getTime() !== nextProps.selDate.getTime()
            || this.props.period !== nextProps.period) {
      this.setState({
        selDate: nextProps.selDate,
        viewDate: nextProps.selDate,
        period: nextProps.period,
      });
    }
  },

  getPrevMonth() {
    const year = this.state.viewDate.getFullYear();
    const month = this.state.viewDate.getMonth();
    const day = this.state.viewDate.getDate();
    this.setState({ viewDate: new Date(year, month - 1, day) });
  },

  getNextMonth() {
    const year = this.state.viewDate.getFullYear();
    const month = this.state.viewDate.getMonth();
    const day = this.state.viewDate.getDate();
    this.setState({ viewDate: new Date(year, month + 1, day) });
  },

  render() {
    return (
      <div className="nav-date">
        <div className="nav-title">
          <div onClick={this.getPrevMonth}>
            <i className="fa fa-chevron-circle-left" aria-hidden="true" />
          </div>
          <div
            id="curr-month"
            data-month={this.state.viewDate.getMonth()}
            data-year={this.state.viewDate.getFullYear()}
          >
            {`${MONTH_NAMES[this.state.viewDate.getMonth()]} ${this.state.viewDate.getFullYear()}`}
          </div>
          <div onClick={this.getNextMonth}>
            <i className="fa fa-chevron-circle-right" aria-hidden="true" />
          </div>
        </div>
        <table className="calendar">
          <thead>
            <tr>
              <td>Sun</td>
              <td>Mon</td>
              <td>Tue</td>
              <td>Wed</td>
              <td>Thu</td>
              <td>Fri</td>
              <td>Sat</td>
            </tr>
          </thead>
          <Month
            selDate={this.state.selDate}
            viewDate={this.state.viewDate}
            period={this.state.period}
          />
        </table>
      </div>
    );
  },
});


export default CalendarWidget;
