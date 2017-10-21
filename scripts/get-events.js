import requests from './utils/requests';
import { getDateStr, getTimeStr } from './viewing-options';

const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;
const MS_IN_MIN = 6000;

function getEventsOfDay(props) {
  const startMS = props.selDate.getTime();
  const endMS = startMS + MS_IN_DAY - MS_IN_MIN;

  requests.getEvents.call(this, startMS, endMS);
}

function getEventsOfWeek(props, firstDateOfWeekMS) {
  const startMS = firstDateOfWeekMS;
  const endMS = startMS + 7 * MS_IN_DAY - MS_IN_MIN;

  requests.getEvents.call(this, startMS, endMS);
}

function getEventsOfMonth(props) {
  const month = props.selDate.getMonth();
  const year = props.selDate.getFullYear();
  const lastDateOfMonth = new Date(year, month, new Date(year, month + 1, 0).getDate());
  const firstDateOfMonth = new Date(year, month, 1);
  const startMS = firstDateOfMonth.getTime() - firstDateOfMonth.getDay() * MS_IN_DAY;
  const endMS = lastDateOfMonth.getTime() + (6 - lastDateOfMonth.getDay() + 1)
    * MS_IN_DAY - MS_IN_MIN;

  const { state } = this;
  state.startDateMS = startMS;
  state.lastDateOfMonthMS = lastDateOfMonth.getTime();
  this.setState(state);

  requests.getEvents.call(this, startMS, endMS);
}

function getThisEvents(state, nextProps) {
  const props = nextProps || this.props;
  const comparePeriod = this.props.period === props.period;
  let { events } = state;

  if (props.period === 'day') {
    if (
      !comparePeriod
      || !nextProps
      || this.props.selDate.getTime() !== nextProps.selDate.getTime()
    ) {
      getEventsOfDay.call(this, props);
      if (state) events = [];
    }
  } else if (props.period === 'week') {
    const thisFirstDateOfWeekMS = this.props.selDate.getTime()
      - this.props.selDate.getDay() * MS_IN_DAY;

    const nextFirstDateOfWeekMS = nextProps
      ? (nextProps.selDate.getTime() - nextProps.selDate.getDay() * MS_IN_DAY)
      : undefined;

    const firstDateOfWeekMS = nextProps ? nextFirstDateOfWeekMS : thisFirstDateOfWeekMS;

    if (!comparePeriod || !nextProps || thisFirstDateOfWeekMS !== nextFirstDateOfWeekMS) {
      getEventsOfWeek.call(this, props, firstDateOfWeekMS);

      if (state) events = [];
    }
  } else if (props.period === 'month') {
    if (
      !comparePeriod
      || !nextProps
      || this.props.selDate.getMonth() !== nextProps.selDate.getMonth()
    ) {
      getEventsOfMonth.call(this, props);
      if (state) events = [];
    }
  }

  if (state) this.setState({ ...state, events });
}

function sortEvents(eventsArr, startMS, endMS) {
  let sortEventsArr = eventsArr.map((value) => {
    const startDate = new Date(value.startDate).getTime();
    const endDate = new Date(value.endDate).getTime();
    const repeatEnd = new Date(value.repeatEnd).getTime();
    return { ...value, startDate, endDate, repeatEnd };
  });

  const repeatEvents = sortEventsArr.filter(value => value.is_repeat === 'repeat');

  const notRepeatEvents = sortEventsArr.filter(value => value.is_repeat !== 'repeat');

  let arrRepeatEvents = [];

  if (repeatEvents !== []) {
    for (let dateMS = startMS; dateMS <= endMS; dateMS += MS_IN_DAY) {
      const arrDayEvents = [];

      repeatEvents.forEach((repeatEvent) => {
        const startDateMS = repeatEvent.startDate;
        const startMidnightMs = new Date(
          new Date(startDateMS).getFullYear(), new Date(startDateMS).getMonth(),
          new Date(startDateMS).getDate()
        ).getTime();

        const dateMidnightMs = new Date(
          new Date(dateMS).getFullYear(), new Date(dateMS).getMonth(),
          new Date(dateMS).getDate()
        ).getTime();

        const bool = repeatEvent.repeatEnd >= dateMS
          && (repeatEvent.repeat_rate === 'every day'
          && repeatEvent.startDate < dateMS + MS_IN_DAY
          || repeatEvent.repeat_rate === 'every month'
          && new Date(repeatEvent.startDate).getDate() === new Date(dateMS).getDate()
          || repeatEvent.repeat_rate === 'every week'
          && (startMidnightMs - dateMidnightMs) % (MS_IN_DAY * 7) === 0);

        if (bool) {
          const ev = JSON.parse(JSON.stringify(repeatEvent));

          ev.startDate = new Date(
            new Date(dateMS).getFullYear(), new Date(dateMS).getMonth(),
            new Date(dateMS).getDate(), new Date(ev.startDate).getHours(),
            new Date(ev.startDate).getMinutes()
          ).getTime();

          ev.endDate = repeatEvent.endDate - repeatEvent.startDate + ev.startDate;
          arrDayEvents.push(ev);
        }
      });

      arrRepeatEvents = arrRepeatEvents.concat(arrDayEvents);
    }
  }

  sortEventsArr = notRepeatEvents.concat(arrRepeatEvents);
  sortEventsArr.sort((a, b) => a.startDate - b.startDate);

  return sortEventsArr;
}


function sortEvForCountMaxLength(eventsArr, dateMidnightMS) {
  return new Array(48).map((item, i) => eventsArr
    .filter((value) => {
      const currTimeMS = dateMidnightMS + i * MS_IN_HOUR / 2;

      return value.startDate <= currTimeMS
                && value.endDate > currTimeMS
                && (value.startDate >= dateMidnightMS
                    && value.endDate < dateMidnightMS + MS_IN_DAY
                    || value.startDate > dateMidnightMS
                    && value.endDate <= dateMidnightMS + MS_IN_DAY)
                || value.startDate === currTimeMS
                && value.endDate === currTimeMS;
    }));
}


function sortDayEventsByHour(eventsArr, dateMidnightMS) {
  const eventsByHours = new Array(49).map((item, i) => {
    let timeEvents;

    if (i === 0) {
      timeEvents = eventsArr.filter(value => value.startDate <= dateMidnightMS
        && value.endDate >= dateMidnightMS + MS_IN_DAY
        || value.startDate < dateMidnightMS
        || value.endDate > dateMidnightMS + MS_IN_DAY);
    } else {
      timeEvents = eventsArr.filter((value) => {
        const currTimeMS = dateMidnightMS + (i - 1) * MS_IN_HOUR / 2;

        if (i === 1) {
          return value.startDate === currTimeMS && value.endDate < dateMidnightMS + MS_IN_DAY;
        }

        return value.startDate === currTimeMS && value.endDate <= dateMidnightMS + MS_IN_DAY;
      });
    }

    return timeEvents;
  });

  return eventsByHours;
}


function sortWeekEventsByDays(eventsArr, firstDateOfWeekMS) {
  const eventsByDays = new Array(7).map((item, i) => eventsArr
    .filter((value) => {
      const startDateMS = value.startDate;
      const endDateMS = value.endDate;
      const dateMS = firstDateOfWeekMS + i * MS_IN_DAY;

      return startDateMS >= dateMS && startDateMS < dateMS + MS_IN_DAY
        || startDateMS < dateMS + MS_IN_DAY && endDateMS > dateMS && endDateMS <= dateMS + MS_IN_DAY
        || startDateMS <= dateMS && endDateMS > dateMS
        || startDateMS === dateMS && endDateMS === dateMS;
    }));

  return eventsByDays;
}


function sortWeekEventsByDuration(eventsArr, firstDateOfWeekMS) {
  const eventsByDuration = eventsArr.map((value, index) => {
    const evSomeDays = value.filter(val => val.startDate < firstDateOfWeekMS + MS_IN_DAY * index
                || val.endDate > firstDateOfWeekMS + MS_IN_DAY * (index + 1));

    const evOneDay = value.filter(val => val.startDate >= firstDateOfWeekMS + MS_IN_DAY * index
                && val.endDate <= firstDateOfWeekMS + MS_IN_DAY * (index + 1));

    return [evSomeDays, evOneDay];
  });
  return eventsByDuration;
}


function getEventDate(ev) {
  const start = new Date(ev.startDate);
  const end = new Date(ev.endDate);
  const startDateStr = getDateStr(start);
  const startTimeStr = getTimeStr(start);
  const endTimeStr = getTimeStr(end);
  let evDateStr;

  if (new Date(ev.startDate).toLocaleDateString() === new Date(ev.endDate).toLocaleDateString()) {
    evDateStr = `${startDateStr} ${startTimeStr} - ${endTimeStr}`;
  } else {
    evDateStr = `${startDateStr} ${startTimeStr} - ${getDateStr(end)} ${endTimeStr}`;
  }

  return evDateStr;
}


export { getThisEvents, sortEvents, sortEvForCountMaxLength, sortDayEventsByHour,
  sortWeekEventsByDays, sortWeekEventsByDuration, getEventDate };
