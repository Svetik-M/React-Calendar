'use strict'


const MS_IN_DAY = 86400000,
      MS_IN_HOUR = 3600000;


function getElementPosition(props) {
    let heightEl = 0,
        leftEl = 0,
        topEl = 0;
    if ((props.scope.props.period === 'day'
    || props.scope.props.period === 'week')
    && props.currEvent.start_date > props.midnight
    && props.currEvent.end_date < props.midnight + MS_IN_DAY) {
        heightEl = getElementHeight(props),
        leftEl = getElementLeftShift(props);
    }

    if (props.scope.props.period === 'week'
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
        heightRow = 26,
        heightEl = 0;

    if (ev.start_date >= midnight && ev.end_date < midnight + MS_IN_DAY
    || ev.start_date > midnight && ev.end_date <= midnight + MS_IN_DAY) {
        heightEl = (ev.end_date - ev.start_date) / MS_IN_HOUR * 2 * heightRow - 6;
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

    let elem = prevEvents[prevEvents.length - 1];
    if (elem && document.getElementById(elem.id)) {
        if (ev.start_date >= midnight || ev.end_date < midnight + MS_IN_DAY) {
            let coordsStart = getCoords(document.getElementById(elem.id).parentElement),
                coordsEl = getCoords(document.getElementById(elem.id));

            leftEl = coordsEl.left - coordsStart.left + (props.scope.props.period === 'week' ? 6 : 15);
        }
    }
    return leftEl;
}


function getElementTopShift(props) {
    let ev = props.currEvent,
        midnight = props.midnight,
        topEl = 0;

    let prevEvents = props.events.filter(function(val, ind) {
        return val.start_date < ev.start_date
            && val.end_date > ev.start_date
             && (val.start_date <= midnight || val.end_date > midnight + MS_IN_DAY);
    });

    let elem = prevEvents[prevEvents.length - 1];
    if (elem && document.getElementById(elem.id)) {
        let coordsStart = getCoords(document.getElementById(elem.id).parentElement.parentElement),
            coordsEl = getCoords(document.getElementById(elem.id));

        topEl = coordsEl.bottom - coordsStart.top;
    }
    return topEl;
}


function getBlockTopShift(events, date) {
    let midnight = date,
        topEl = 0;

    let prevEvents = events.filter(val => val.start_date < date && val.end_date > date);

    if (prevEvents.length > 0) {
        let prevDate = date - MS_IN_DAY,
            prevDayPrevEv = events.filter(val => {
                return val.start_date < prevDate && val.end_date > prevDate
                    || val.start_date > prevDate && val.start_date < date  && val.end_date > date
            }),
            index = prevDayPrevEv.findIndex(v => v.id === prevEvents[prevEvents.length - 1].id);

        topEl = index + 1;
    }
    return topEl;
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
