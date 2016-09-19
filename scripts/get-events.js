'use strict'

import requests from './request.js';


const MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000,
      MS_IN_MIN = 6000;


var getEvents = {

    getThisEvents: function(nextProps) {
        var props = nextProps || this.props,
            comparePeriod = this.props.period === props.period;

        if (props.period === 'day') {
            if (!comparePeriod || !nextProps || this.props.day.getTime() !== nextProps.day.getTime()) {
                getEvents.getEventsOfDay.call(this, props);
            }

        } else if (props.period === 'week') {
            let firstDayThisProps = this.props.day.getTime() - this.props.day.getDay() * MS_IN_DAY,
                firstDayNextProps = nextProps ? (nextProps.day.getTime() - nextProps.day.getDay() * MS_IN_DAY)
                                              : undefined,
                firstDay = nextProps ? firstDayNextProps : firstDayThisProps;
            if (!comparePeriod || !nextProps || firstDayThisProps !== firstDayNextProps) {
                getEvents.getEventsOfWeek.call(this, props, firstDay);
            }

        } else if (props.period === 'month') {
            if (!comparePeriod || !nextProps || this.props.day.getMonth() !== nextProps.day.getMonth()) {
                getEvents.getEventsOfMonth.call(this, props);
            }
        }
    },


    getEventsOfDay: function(props) {
        var start = props.day.getTime(),
            end = start + MS_IN_DAY - MS_IN_MIN;

        requests.getEvents.call(this, start, end);
    },


    getEventsOfWeek: function(props, dateFirst) {
        var start = dateFirst,
            end = dateFirst + 7 * MS_IN_DAY - MS_IN_MIN;

        requests.getEvents.call(this, start, end);
    },


    getEventsOfMonth: function(props) {
        var month = props.day.getMonth(),
            year = props.day.getFullYear(),
            lastDayOfMonth = new Date(year ,month+1, 0).getDate(),
            dateLast = new Date(year, month, lastDayOfMonth),
            DOW_last = dateLast.getDay(),
            dateFirst = new Date(year, month, 1),
            DOW_first = dateFirst.getDay(),
            currDay = dateFirst.getTime() - DOW_first * MS_IN_DAY,
            start = currDay,
            end = dateLast.getTime() + (6 - DOW_last + 1) * MS_IN_DAY - MS_IN_MIN;

        var state = this.state;
        state.currDay = currDay;
        state.dateLast = dateLast.getTime();
        this.setState(state);

        requests.getEvents.call(this, start, end);
    },


    sortEvents: function(arr, start, end) {
        var arrOfEvents = arr.map(value => {
            value.start_date = new Date(value.start_date).getTime();
            value.end_date = new Date(value.end_date).getTime();
            value.repeat_end = new Date(value.repeat_end).getTime();
            return value;
        });

        var repeatEvents = arrOfEvents.filter(value => {
            return value.is_repeat === 'repeat';
        });

        var notRepeatEvents = arrOfEvents.filter(value => {
            return value.is_repeat !== 'repeat';
        });

        var arrRepeatEvents = [];

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


    sortDayEventsByHour: function(eventsArr, midnight) {
        var arrOfEvents = Array.from({length: 49});

        for (let i = 0; i < 49; i ++) {
            let arr

            if (i === 0) {
                arr = eventsArr.filter(value => {
                    let start = new Date(value.start_date).getTime(),
                        end = new Date(value.end_date).getTime();
                    return start <= midnight && end >= midnight + MS_IN_DAY;
                });

            } else if (i === 1) {
                arr = eventsArr.filter(value => {
                    let start = new Date(value.start_date).getTime(),
                        end = new Date(value.end_date).getTime();
                    return start <= midnight && end < midnight + MS_IN_DAY;
                });

            } else {
                arr = eventsArr.filter(value => {
                    let start = new Date(value.start_date).getTime(),
                        currTime = midnight + (i - 1) * MS_IN_HOUR / 2;
                    return start === currTime;
                });
            }

            arrOfEvents[i] = arr;
        };

        return arrOfEvents;
    },


    sortWeekEventsByDays: function(eventsArr, date) {
        var arrOfEvents = Array.from({length: 7}),
            optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'};

        for (let i = 0; i < 7; i++) {
            let arr = eventsArr.filter(value => {
                let start = value.start_date,
                    end = value.end_date,
                    day = date + i * MS_IN_DAY;
                return start >= day && start < day + MS_IN_DAY ||
                       end > day && end <= day + MS_IN_DAY ||
                       start < day && end > day;
            });

            arrOfEvents[i] = arr;
        };

        return arrOfEvents;
    }
}


export default getEvents;
