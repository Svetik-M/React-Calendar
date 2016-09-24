'use strict'


import requests from './requests.js';


const MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000,
      MS_IN_MIN = 6000;


let getEvents = {

    getThisEvents: function(state, nextProps) {
        let props = nextProps || this.props,
            comparePeriod = this.props.period === props.period;

        if (props.period === 'day') {
            if (!comparePeriod || !nextProps || this.props.day.getTime() !== nextProps.day.getTime()) {
                getEvents.getEventsOfDay.call(this, props);
                if (state) state.events = [];
            }

        } else if (props.period === 'week') {
            let firstDayThisProps = this.props.day.getTime() - this.props.day.getDay() * MS_IN_DAY,
                firstDayNextProps = nextProps ? (nextProps.day.getTime() - nextProps.day.getDay() * MS_IN_DAY)
                                              : undefined,
                firstDay = nextProps ? firstDayNextProps : firstDayThisProps;
            if (!comparePeriod || !nextProps || firstDayThisProps !== firstDayNextProps) {
                getEvents.getEventsOfWeek.call(this, props, firstDay);
                if (state) state.events = [];
            }

        } else if (props.period === 'month') {
            if (!comparePeriod || !nextProps || this.props.day.getMonth() !== nextProps.day.getMonth()) {
                getEvents.getEventsOfMonth.call(this, props);
                if (state) state.events = [];
            }
        }

        if (state) this.setState(state);
    },


    getEventsOfDay: function(props) {
        let start = props.day.getTime(),
            end = start + MS_IN_DAY - MS_IN_MIN;

        requests.getEvents.call(this, start, end);
    },


    getEventsOfWeek: function(props, dateFirst) {
        let start = dateFirst,
            end = dateFirst + 7 * MS_IN_DAY - MS_IN_MIN;

        requests.getEvents.call(this, start, end);
    },


    getEventsOfMonth: function(props) {
        let month = props.day.getMonth(),
            year = props.day.getFullYear(),
            lastDayOfMonth = new Date(year ,month+1, 0).getDate(),
            dateLast = new Date(year, month, lastDayOfMonth),
            DOW_last = dateLast.getDay(),
            dateFirst = new Date(year, month, 1),
            DOW_first = dateFirst.getDay(),
            currDay = dateFirst.getTime() - DOW_first * MS_IN_DAY,
            start = currDay,
            end = dateLast.getTime() + (6 - DOW_last + 1) * MS_IN_DAY - MS_IN_MIN;

        let state = this.state;
        state.currDay = currDay;
        state.dateLast = dateLast.getTime();
        this.setState(state);

        requests.getEvents.call(this, start, end);
    },


    sortEvents: function(arr, start, end) {
        let arrOfEvents = arr.map(value => {
            value.start_date = new Date(value.start_date).getTime();
            value.end_date = new Date(value.end_date).getTime();
            value.repeat_end = new Date(value.repeat_end).getTime();
            return value;
        });

        let repeatEvents = arrOfEvents.filter(value => {
            return value.is_repeat === 'repeat';
        });

        let notRepeatEvents = arrOfEvents.filter(value => {
            return value.is_repeat !== 'repeat';
        });

        let arrRepeatEvents = [];

        if (repeatEvents !== []) {
            for (let day = start; day <= end; day += MS_IN_DAY) {
                let arrDay = [];

                for (let j = repeatEvents.length - 1; j >= 0; j--) {
                    let startDate = repeatEvents[j].start_date
                    let bool =  repeatEvents[j].repeat_end >= day
                            && (repeatEvents[j].repeat_rate === 'every day'
                            && repeatEvents[j].start_date < day + MS_IN_DAY
                            || repeatEvents[j].repeat_rate === 'every month'
                            && new Date(repeatEvents[j].start_date).getDate() === new Date(day).getDate()
                            || repeatEvents[j].repeat_rate === 'every week'
                            && (new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth(),
                                new Date(startDate).getDate()).getTime() -
                                new Date(new Date(day).getFullYear(), new Date(day).getMonth(),
                                new Date(day).getDate()).getTime()) % (MS_IN_DAY*7) === 0)

                    if (bool) {
                        let ev = Object.assign({}, repeatEvents[j]);

                        ev.start_date = new Date(new Date(day).getFullYear(), new Date(day).getMonth(),
                                        new Date(day).getDate(), new Date(ev.start_date).getHours(),
                                        new Date(ev.start_date).getMinutes()).getTime();
                        ev.end_date = repeatEvents[j].end_date - repeatEvents[j].start_date + ev.start_date;

                        arrDay.push(ev)
                    }
                }

                arrRepeatEvents = arrRepeatEvents.concat(arrDay);
            }
        }

        arrOfEvents = notRepeatEvents.concat(arrRepeatEvents);

        arrOfEvents.sort(function(a, b) {
            return a.start_date - b.start_date;
        });

        return arrOfEvents;
    },


    sortEvForCountMaxLength: function(eventsArr, midnight) {
        let arrOfEvents = Array.from({length: 48});
        for (let i = 0; i < 48; i ++) {
            let arr = eventsArr.filter(value => {
                let currTime = midnight + (i - 1) * MS_IN_HOUR / 2;

                return value.start_date >= midnight
                    && value.start_date <= currTime
                    && value.end_date > currTime
                    && value.end_date < midnight + MS_IN_DAY;
            });

            arrOfEvents[i] = arr;
        };

        return arrOfEvents;
    },


    sortDayEventsByHour: function(eventsArr, midnight) {
        let arrOfEvents = Array.from({length: 49});

        for (let i = 0; i < 49; i ++) {
            let arr

            if (i === 0) {
                arr = eventsArr.filter(value => {
                    return value.start_date <= midnight && value.end_date >= midnight + MS_IN_DAY});

            } else {
                arr = eventsArr.filter(value => {
                    let currTime = midnight + (i - 1) * MS_IN_HOUR / 2;
                    return value.start_date === currTime && value.end_date < midnight + MS_IN_DAY;
                });
            }

            arrOfEvents[i] = arr;
        };

        return arrOfEvents;
    },


    sortWeekEventsByDays: function(eventsArr, date) {
        let arrOfEvents = Array.from({length: 7}),
            optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'};

        for (let i = 0; i < 7; i++) {
            let arr = eventsArr.filter(value => {
                let start = value.start_date,
                    end = value.end_date,
                    day = date + i * MS_IN_DAY;
                return start >= day && start < day + MS_IN_DAY ||
                       start < day + MS_IN_DAY && end > day && end <= day + MS_IN_DAY ||
                       start <= day && end >= day;
            });

            arrOfEvents[i] = arr;
        };

        return arrOfEvents;
    },


    sortWeekEventsByDuration: function(arr, date) {
        let arrOfEvents = arr.map((value, index) => {
            let evSomeDays = value.filter(val => {
                return val.start_date < date + MS_IN_DAY * index
                    || val.end_date > date + MS_IN_DAY * (index + 1);
            });

            let evOneDay = value.filter(val => {
                return val.start_date >= date + MS_IN_DAY * index
                    && val.end_date <= date + MS_IN_DAY * (index + 1);
            });

            return [evSomeDays, evOneDay];
        });
        return arrOfEvents;
    }
}


export default getEvents;
