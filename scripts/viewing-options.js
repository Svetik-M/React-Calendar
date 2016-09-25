'use strict'


const MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000;


function getElementPosition(props) {
    let heightEl = 0,
        leftEl = 0,
        topEl = 0;
    if ((props.period === 'day'
    || props.period === 'week')
    && props.currEvent.start_date > props.midnight
    && props.currEvent.end_date < props.midnight + MS_IN_DAY) {
        heightEl = getElementHeight(props),
        leftEl = getElementLeftShift(props);
    }

    if (props.period === 'week'
    && props.DOW !== 0
    && (props.currEvent.start_date === props.midnight
    && props.currEvent.end_date === props.midnight + MS_IN_DAY
    || props.currEvent.start_date < props.midnight
    || props.currEvent.end_date > props.midnight + MS_IN_DAY)) {
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
        midnight = props.midnight,
        heightRow = 25.95,
        heightEl = 0;

    if (ev.start_date >= midnight && ev.end_date < midnight + MS_IN_DAY
    || ev.start_date > midnight && ev.end_date <= midnight + MS_IN_DAY) {
        heightEl = (ev.end_date - ev.start_date) / MS_IN_HOUR * 2 * heightRow - 5;
    }
    return heightEl;
}


function getElementLeftShift(props) {
    let ev = props.currEvent,
        midnight = props.midnight,
        leftEl = 0;

    let prevEvents = props.events.filter(function(val, ind) {
        return val.start_date < ev.start_date
            && val.end_date > ev.start_date
            && (val.start_date >= midnight && val.end_date < midnight + MS_IN_DAY
            || val.start_date > midnight && val.end_date <= midnight + MS_IN_DAY)
    });

    let elem = prevEvents[prevEvents.length - 1],
        id = elem ? elem.id + '-' + midnight : '';

    if (elem && document.getElementById(id)) {
        if (ev.start_date >= midnight || ev.end_date < midnight + MS_IN_DAY) {
            let coordsStart = getCoords(document.getElementById(id).parentElement),
                coordsEl = getCoords(document.getElementById(id));

            leftEl = coordsEl.left - coordsStart.left + (props.period === 'week' ? 6 : 15);
        }
    }
    return leftEl;
}


function getElementTopShift(props) {
    let ev = props.currEvent,
        midnight = props.midnight,
        firstDay = props.midnight - MS_IN_DAY * new Date(props.midnight).getDay(),
        topEl = 0;

    let prevEvents = props.events.filter(function(val, ind) {
        return val.start_date < ev.start_date
            && val.end_date > ev.start_date
            && (val.start_date <= midnight || val.end_date > midnight + MS_IN_DAY);
    });

    let elem = prevEvents[prevEvents.length - 1],
        id;

    if (elem && elem.start_date >= firstDay) {
        id = elem.id + '-' + new Date(new Date(elem.start_date).toLocaleDateString()).getTime();
    } else if (elem && elem.start_date < firstDay) {
        id = elem.id + '-' + firstDay;
    }

    if (elem && document.getElementById(id)) {
        let coordsStart = getCoords(document.getElementById(id).parentElement.parentElement),
            coordsEl = getCoords(document.getElementById(id));

        topEl = coordsEl.bottom - coordsStart.top;
    }
    return topEl;
}


function getBlockTopShift(arrOfEvents, firstDay) {
    let arr = arrOfEvents.map((value, index) => {
        return value[0].filter((v, i) => {
            return v.start_date < firstDay + index * MS_IN_DAY;
        });
    });

    let arrTopEl = Array.from({length: 7});

    return arrTopEl = arrTopEl.map((val, ind) => {
        let elem = arr[ind][arr[ind].length - 1],
            index;

        if (elem && ind > 0) {
            let date = new Date(new Date(elem.start_date).getFullYear(), new Date(elem.start_date).getMonth(),
                                new Date(elem.start_date).getDate()).getTime(),
                dayOfWeek = (date - firstDay) / MS_IN_DAY,
                indDay = dayOfWeek > 0 ? dayOfWeek : ind - 1;

            index= arrOfEvents[indDay][0].findIndex(v => v.id === elem.id) + 1;
        } else {
            index = 0;
        }

         return index;
    });
}


function getCoords(elem) {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        bottom: box.bottom + pageYOffset,
        left: box.left + pageXOffset
    };
}


export {getElementPosition, getBlockTopShift}
