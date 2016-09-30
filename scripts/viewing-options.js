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
        let optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'};
        id = elem.id + '-' + new Date(new Date(elem.start_date).toLocaleString('en-US', optionsDate)).getTime();

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

    let arrTopEl = Array.from({length: 7});

    return arrTopEl = arrTopEl.map((val, ind) => {
        let elem = arr[ind][arr[ind].length - 1],
            index;

        if (elem && ind > 0) {
            let dateMS = new Date(new Date(elem.start_date).getFullYear(), new Date(elem.start_date).getMonth(),
                                new Date(elem.start_date).getDate()).getTime(),
                dayOfWeek = (dateMS - firstDateOfWeekMS) / MS_IN_DAY,
                indDay = dayOfWeek > 0 ? dayOfWeek : 0;

            index= arrOfEvents[indDay][0].findIndex(v => v.id === elem.id) + 1;
        } else {
            index = 0;
        }

         return index;
    });
}


function getStartDateStrAndCoefWidth(currEvent, index, dateMidnightMS) {
    let startDateMS = currEvent.start_date,
        endDateMS = currEvent.end_date,
        optionsDate = {year: 'numeric', month: '2-digit', day: '2-digit'},
        optionsTime = {hour: '2-digit', minute: '2-digit'},
        startDateMidnightMS = new Date(new Date(startDateMS).toLocaleString('en-US', optionsDate)).getTime(),
        endDateMidnightMS = new Date(new Date(endDateMS).toLocaleString('en-US', optionsDate)).getTime(),
        startDateStr, coefWidth;

    if (startDateMS < dateMidnightMS && index !== 0) {
        return undefined;

    } else if (startDateMS < dateMidnightMS && index === 0) {
        startDateStr = '';
        coefWidth = (endDateMidnightMS - dateMidnightMS) / MS_IN_DAY + 1;

    } else if (startDateMS >= dateMidnightMS && startDateMS < dateMidnightMS + MS_IN_DAY) {
        startDateStr = new Date(startDateMS).toLocaleString('en-US', optionsTime).toLowerCase().replace(' ', '');
        coefWidth = (endDateMidnightMS - startDateMidnightMS) / MS_IN_DAY + 1;

    } else {
        startDateStr = new Date(startDateMS).toLocaleString('en-US', optionsTime).toLowerCase().replace(' ', '');
    }

    if (coefWidth === 0) coefWidth = 1;
    if (endDateMS === endDateMidnightMS) coefWidth--;
    if (coefWidth >  7) coefWidth = 7;
    if (coefWidth >  6 - index + 1) coefWidth = 6 - index + 1;

    return {
        startDateStr: startDateStr,
        coefWidth: coefWidth
    };
}


function getCoords(elem) {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        bottom: box.bottom + pageYOffset,
        left: box.left + pageXOffset
    };
}


export {getElementPosition, getBlockTopShift, getStartDateStrAndCoefWidth}
