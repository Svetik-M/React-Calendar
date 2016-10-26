'use strict'


import requests from './requests.js';


const MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000,
      MS_IN_MIN = 6000;


function getThisEvents(state, nextProps) {
    let props = nextProps || this.props,
        comparePeriod = this.props.period === props.period;

    if (props.period === 'day') {
        if (!comparePeriod || !nextProps || this.props.selDate.getTime() !== nextProps.selDate.getTime()) {
            getEventsOfDay.call(this, props);
            if (state) state.events = [];
        }

    } else if (props.period === 'week') {
        let thisFirstDateOfWeekMS = this.props.selDate.getTime() - this.props.selDate.getDay() * MS_IN_DAY,
            nextFirstDateOfWeekMS = nextProps ? (nextProps.selDate.getTime() - nextProps.selDate.getDay() * MS_IN_DAY)
                                          : undefined,
            firstDateOfWeekMS = nextProps ? nextFirstDateOfWeekMS : thisFirstDateOfWeekMS;

        if (!comparePeriod || !nextProps || thisFirstDateOfWeekMS !== nextFirstDateOfWeekMS) {
            getEventsOfWeek.call(this, props, firstDateOfWeekMS);

            if (state) state.events = [];
        }

    } else if (props.period === 'month') {
        if (!comparePeriod || !nextProps || this.props.selDate.getMonth() !== nextProps.selDate.getMonth()) {
            getEventsOfMonth.call(this, props);
            if (state) state.events = [];
        }
    }

    if (state) this.setState(state);
}


function getEventsOfDay(props) {
    let startMS = props.selDate.getTime(),
        endMS = startMS + MS_IN_DAY - MS_IN_MIN;

    requests.getEvents.call(this, startMS, endMS);
}


function getEventsOfWeek(props, firstDateOfWeekMS) {
    let startMS = firstDateOfWeekMS,
        endMS = startMS + 7 * MS_IN_DAY - MS_IN_MIN;

    requests.getEvents.call(this, startMS, endMS);
}


function getEventsOfMonth(props) {
    let month = props.selDate.getMonth(),
        year = props.selDate.getFullYear(),
        lastDateOfMonth = new Date(year, month, new Date(year, month+1, 0).getDate()),
        firstDateOfMonth = new Date(year, month, 1),
        startMS = firstDateOfMonth.getTime() - firstDateOfMonth.getDay() * MS_IN_DAY,
        endMS = lastDateOfMonth.getTime() + (6 - lastDateOfMonth.getDay() + 1) * MS_IN_DAY - MS_IN_MIN;

    let state = this.state;
    state.startDateMS = startMS;
    state.lastDateOfMonthMS = lastDateOfMonth.getTime();
    this.setState(state);

    requests.getEvents.call(this, startMS, endMS);
}


function sortEvents(eventsArr, startMS, endMS) {
    let sortEventsArr = eventsArr.map(value => {
        value.start_date = new Date(value.start_date).getTime();
        value.end_date = new Date(value.end_date).getTime();
        value.repeat_end = new Date(value.repeat_end).getTime();
        return value;
    });

    let repeatEvents = sortEventsArr.filter(value => {
        return value.is_repeat === 'repeat';
    });

    let notRepeatEvents = sortEventsArr.filter(value => {
        return value.is_repeat !== 'repeat';
    });

    let arrRepeatEvents = [];

    if (repeatEvents !== []) {
        for (let dateMS = startMS; dateMS <= endMS; dateMS += MS_IN_DAY) {
            let arrDayEvents = [];

            for (let j = repeatEvents.length - 1; j >= 0; j--) {
                let startDateMS = repeatEvents[j].start_date,
                    optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'},
                    bool =  repeatEvents[j].repeat_end >= dateMS
                        && (repeatEvents[j].repeat_rate === 'every day'
                        && repeatEvents[j].start_date < dateMS + MS_IN_DAY
                        || repeatEvents[j].repeat_rate === 'every month'
                        && new Date(repeatEvents[j].start_date).getDate() === new Date(dateMS).getDate()
                        || repeatEvents[j].repeat_rate === 'every week'
                        && (new Date(new Date(startDateMS).toLocaleString('en-US', optionsDate)).getTime()
                            - new Date(new Date(dateMS).toLocaleString('en-US', optionsDate)).getTime())
                            % (MS_IN_DAY * 7) === 0)

                if (bool) {
                    let ev = JSON.parse(JSON.stringify(repeatEvents[j]));

                    ev.start_date = new Date(new Date(dateMS).getFullYear(), new Date(dateMS).getMonth(),
                                    new Date(dateMS).getDate(), new Date(ev.start_date).getHours(),
                                    new Date(ev.start_date).getMinutes()).getTime();
                    ev.end_date = repeatEvents[j].end_date - repeatEvents[j].start_date + ev.start_date;

                    arrDayEvents.push(ev)
                }
            }

            arrRepeatEvents = arrRepeatEvents.concat(arrDayEvents);
        }
    }

    sortEventsArr = notRepeatEvents.concat(arrRepeatEvents);

    sortEventsArr.sort(function(a, b) {
        return a.start_date - b.start_date;
    });

    return sortEventsArr;
}


function sortEvForCountMaxLength(eventsArr, dateMidnightMS) {
    let arrOfEvents = new Array(48);

    for (let i = 0; i < 48; i ++) {
        let arr = eventsArr.filter(value => {
            let currTimeMS = dateMidnightMS + i * MS_IN_HOUR / 2;

            return value.start_date <= currTimeMS
                && value.end_date > currTimeMS
                && (value.start_date >= dateMidnightMS
                    && value.end_date < dateMidnightMS + MS_IN_DAY
                    || value.start_date > dateMidnightMS
                    && value.end_date <= dateMidnightMS + MS_IN_DAY)
                || value.start_date === currTimeMS
                && value.end_date === currTimeMS;
        });

        arrOfEvents[i] = arr;
    };

    return arrOfEvents;
}


function sortDayEventsByHour(eventsArr, dateMidnightMS) {
    let eventsByHours = new Array(49);

    for (let i = 0; i < 49; i ++) {
        let timeEvents

        if (i === 0) {
            timeEvents = eventsArr.filter(value => {
                return value.start_date <= dateMidnightMS && value.end_date >= dateMidnightMS + MS_IN_DAY
                    || value.start_date < dateMidnightMS
                    || value.end_date > dateMidnightMS + MS_IN_DAY;
            });

        } else {
            timeEvents = eventsArr.filter(value => {
                let currTimeMS = dateMidnightMS + (i - 1) * MS_IN_HOUR / 2;

                if (i === 1) return value.start_date === currTimeMS && value.end_date < dateMidnightMS + MS_IN_DAY;

                return value.start_date === currTimeMS && value.end_date <= dateMidnightMS + MS_IN_DAY;
            });
        }

        eventsByHours[i] = timeEvents;
    };

    return eventsByHours;
}


function sortWeekEventsByDays(eventsArr, firstDateOfWeekMS) {
    let eventsByDays =new Array(7),
        optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'};

    for (let i = 0; i < 7; i++) {
        let dayEvents = eventsArr.filter(value => {
            let startDateMS = value.start_date,
                endDateMS = value.end_date,
                dateMS = firstDateOfWeekMS + i * MS_IN_DAY;
            return startDateMS >= dateMS && startDateMS < dateMS + MS_IN_DAY
                   || startDateMS < dateMS + MS_IN_DAY && endDateMS > dateMS && endDateMS <= dateMS + MS_IN_DAY
                   || startDateMS <= dateMS && endDateMS > dateMS
                   || startDateMS === dateMS && endDateMS === dateMS;
        });

        eventsByDays[i] = dayEvents;
    };

    return eventsByDays;
}


function sortWeekEventsByDuration(eventsArr, firstDateOfWeekMS) {
    let eventsByDuration = eventsArr.map((value, index) => {
        let evSomeDays = value.filter(val => {
            return val.start_date < firstDateOfWeekMS + MS_IN_DAY * index
                || val.end_date > firstDateOfWeekMS + MS_IN_DAY * (index + 1);
        });

        let evOneDay = value.filter(val => {
            return val.start_date >= firstDateOfWeekMS + MS_IN_DAY * index
                && val.end_date <= firstDateOfWeekMS + MS_IN_DAY * (index + 1);
        });

        return [evSomeDays, evOneDay];
    });
    return eventsByDuration;
}


function getEventDate(ev) {
    let optionsTime = {hour: '2-digit', minute: '2-digit'},
        optionsDateTime = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'},
        evDateStr;

    if (new Date(ev.start_date).toLocaleDateString() === new Date(ev.end_date).toLocaleDateString()) {
        evDateStr = new Date(ev.start_date).toLocaleString('en-US', optionsDateTime).replace('0 ', '0')
            + ' - ' + new Date(ev.end_date).toLocaleString('en-US', optionsTime).replace('0 ', '0');
    } else {
        evDateStr = new Date(ev.start_date).toLocaleString('en-US', optionsDateTime).replace('0 ', '0')
            + ' - ' + new Date(ev.end_date).toLocaleString('en-US', optionsDateTime).replace('0 ', '0');
    }

    return evDateStr
}


export {getThisEvents, sortEvents, sortEvForCountMaxLength, sortDayEventsByHour,
    sortWeekEventsByDays, sortWeekEventsByDuration, getEventDate};
