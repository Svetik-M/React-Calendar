'use strict'


const MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000;


function getElementPosition(props) {
    let heightEl = 0,
        leftEl = 0,
        topEl = 0,
        dateMidnightMS = props.dateMidnightMS,
        ev = props.currEvent;

    if ((props.period === 'day'
        || props.period === 'week')
        && ev.start_date > dateMidnightMS
        && ev.end_date < dateMidnightMS + MS_IN_DAY) {

        heightEl = getElementHeight(props),
        leftEl = getElementLeftShift(props);
    }

    if (props.period === 'week'
        && new Date(dateMidnightMS).getDay() !== 0
        && (ev.start_date === dateMidnightMS
        && ev.end_date === dateMidnightMS + MS_IN_DAY
        || ev.start_date < dateMidnightMS
        || ev.end_date > dateMidnightMS + MS_IN_DAY)) {

        topEl = getElementTopShift(props);
    }

    return {
        heightEl: heightEl,
        leftEl: leftEl,
        topEl: topEl
    };
}


function getElementHeight(props) {
    let ev = props.currEvent,
        dateMidnightMS = props.dateMidnightMS,
        heightRow = 25.95,
        heightEl = 0;

    if (ev.start_date >= dateMidnightMS && ev.end_date < dateMidnightMS + MS_IN_DAY
    || ev.start_date > dateMidnightMS && ev.end_date <= dateMidnightMS + MS_IN_DAY) {
        heightEl = (ev.end_date - ev.start_date) / MS_IN_HOUR * 2 * heightRow - 5;
    }
    return heightEl;
}


function getElementLeftShift(props) {
    let ev = props.currEvent,
        dateMidnightMS = props.dateMidnightMS,
        leftEl = 0;

    let prevEvents = props.events.filter(function(val, ind) {
        return val.start_date < ev.start_date
            && val.end_date > ev.start_date
            && (val.start_date >= dateMidnightMS && val.end_date < dateMidnightMS + MS_IN_DAY
            || val.start_date > dateMidnightMS && val.end_date <= dateMidnightMS + MS_IN_DAY)
    });

    let elem = prevEvents[prevEvents.length - 1],
        id = elem ? elem.id + '-' + dateMidnightMS : '';

    if (elem && document.getElementById(id)) {
        if (ev.start_date >= dateMidnightMS || ev.end_date < dateMidnightMS + MS_IN_DAY) {
            let coordsStart = getCoords(document.getElementById(id).parentElement),
                coordsEl = getCoords(document.getElementById(id));

            leftEl = coordsEl.left - coordsStart.left + (props.period === 'week' ? 6 : 15);
        }
    }
    return leftEl;
}


function getElementTopShift(props) {
    let ev = props.currEvent,
        dateMidnightMS = props.dateMidnightMS,
        firstDateOfWeekMS = dateMidnightMS - MS_IN_DAY * new Date(dateMidnightMS).getDay(),
        topEl = 0;

    let prevEvents = props.events.filter(function(val, ind) {
        return val.start_date < ev.start_date
            && val.end_date > dateMidnightMS
            && (val.start_date < dateMidnightMS || val.end_date > dateMidnightMS + MS_IN_DAY);
    });

    let elem = prevEvents[prevEvents.length - 1],
        id;

    if (elem && elem.start_date >= firstDateOfWeekMS) {
        let date = new Date(elem.start_date);
        id = elem.id + '-' + new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

    } else if (elem && elem.start_date < firstDateOfWeekMS) {
        id = elem.id + '-' + firstDateOfWeekMS;
    }

    if (elem && document.getElementById(id)) {
        let coordsStart = getCoords(document.getElementById(id).parentElement.parentElement),
            coordsEl = getCoords(document.getElementById(id));

        topEl = coordsEl.bottom - coordsStart.top - 2;
    }
    return topEl;
}


function getBlockTopShift(arrOfEvents, firstDateOfWeekMS) {
    let arr = arrOfEvents.map((value, index) => {
        return value[0].filter((v, i) => {
            return v.start_date < firstDateOfWeekMS + index * MS_IN_DAY;
        });
    });

    let arrTopEl = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];

    return arrTopEl = arrTopEl.map((val, ind) => {
        let elem = arr[ind][arr[ind].length - 1],
            index;

        if (elem && ind > 0) {
            let dateMS = new Date(new Date(elem.start_date).getFullYear(), new Date(elem.start_date).getMonth(),
                                new Date(elem.start_date).getDate()).getTime(),
                dayOfWeek = (dateMS - firstDateOfWeekMS) / MS_IN_DAY,
                indDay = dayOfWeek > 0 ? dayOfWeek : 0;

            let el = arrOfEvents[indDay][0].filter(v => v.id === elem.id)

            index = arrOfEvents[indDay][0].indexOf(el[0]) + 1;
        } else {
            index = 0;
        }

         return index;
    });
}


function getStartDateStrAndCoefWidth(currEvent, index, dateMidnightMS) {
    let startDateMS = currEvent.start_date,
        endDateMS = currEvent.end_date,
        startDate = new Date(currEvent.start_date),
        endDate = new Date(currEvent.end_date),
        startDateMidnightMS = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime(),
        endDateMidnightMS = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime(),
        startTimeStr, coefWidth;

    if (startDateMS < dateMidnightMS && index !== 0) {
        return undefined;

    } else if (startDateMS < dateMidnightMS && index === 0) {
        startTimeStr = '';
        coefWidth = (endDateMidnightMS - dateMidnightMS) / MS_IN_DAY + 1;

    } else if (startDateMS >= dateMidnightMS && startDateMS < dateMidnightMS + MS_IN_DAY) {
        startTimeStr = getTimeStr(startDate);
        coefWidth = (endDateMidnightMS - startDateMidnightMS) / MS_IN_DAY + 1;

    } else {
        startTimeStr = getTimeStr(startDate);
    }

    if (coefWidth === 0) coefWidth = 1;
    if (endDateMS === endDateMidnightMS) coefWidth--;
    if (coefWidth >  7) coefWidth = 7;
    if (coefWidth >  6 - index + 1) coefWidth = 6 - index + 1;

    return {
        startDateStr: startTimeStr,
        coefWidth: coefWidth
    };
}


function getDateStr(date) {
    return `${(date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)}`+
            `/${(date.getDate() < 10 ? '0' : '') + date.getDate()}/${date.getFullYear()}`;
}


function getTimeStr(date) {
    let hours = date.getHours(),
        minutes = (date.getMinutes() === 0 ? '00' : '30'),
        timeStr;

    if (hours === 0) timeStr = `${12}:${minutes}am`;
    else if (hours < 12) timeStr = `${hours}:${minutes}am`;
    else if (hours === 12) timeStr = `${12}:${minutes}pm`;
    else if (hours > 12) timeStr = `${hours-12}:${minutes}pm`;

    return timeStr;
}


function getCoords(elem) {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        bottom: box.bottom + pageYOffset,
        left: box.left + pageXOffset
    };
}


export {getElementPosition, getBlockTopShift, getStartDateStrAndCoefWidth, getDateStr, getTimeStr};
