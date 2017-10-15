const MS_IN_DAY = 86400000;
const MS_IN_HOUR = 3600000;

function getDateStr(date) {
  return `${(date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)}` +
    `/${(date.getDate() < 10 ? '0' : '') + date.getDate()}/${date.getFullYear()}`;
}


function getTimeStr(date) {
  const hours = date.getHours();
  const minutes = (date.getMinutes() === 0 ? '00' : '30');
  let timeStr;

  if (hours === 0) timeStr = `${12}:${minutes}am`;
  else if (hours < 12) timeStr = `${hours}:${minutes}am`;
  else if (hours === 12) timeStr = `${12}:${minutes}pm`;
  else if (hours > 12) timeStr = `${hours - 12}:${minutes}pm`;

  return timeStr;
}


function getCoords(elem) {
  const box = elem.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset,
  };
}

function getElementHeight(props) {
  const ev = props.currEvent;
  const { dateMidnightMS } = props;
  const heightRow = 25.95;
  let heightEl = 0;

  if (
    ev.startDate >= dateMidnightMS && ev.endDate < dateMidnightMS + MS_IN_DAY
    || ev.startDate > dateMidnightMS && ev.endDate <= dateMidnightMS + MS_IN_DAY
  ) {
    heightEl = (ev.endDate - ev.startDate) / MS_IN_HOUR * 2 * heightRow - 5;
  }
  return heightEl;
}


function getElementLeftShift(props) {
  const ev = props.currEvent;
  const { dateMidnightMS } = props;
  let leftEl = 0;

  const prevEvents = props.events.filter(val => val.startDate < ev.startDate
    && val.endDate > ev.startDate
    && (val.startDate >= dateMidnightMS && val.endDate < dateMidnightMS + MS_IN_DAY
    || val.startDate > dateMidnightMS && val.endDate <= dateMidnightMS + MS_IN_DAY));

  const elem = prevEvents[prevEvents.length - 1];
  const id = elem ? `${elem.id}-${dateMidnightMS}` : '';

  if (elem && document.getElementById(id)) {
    if (ev.startDate >= dateMidnightMS || ev.endDate < dateMidnightMS + MS_IN_DAY) {
      const coordsStart = getCoords(document.getElementById(id).parentElement);
      const coordsEl = getCoords(document.getElementById(id));

      leftEl = coordsEl.left - coordsStart.left + (props.period === 'week' ? 6 : 15);
    }
  }
  return leftEl;
}


function getElementTopShift(props) {
  const ev = props.currEvent;
  const { dateMidnightMS } = props;
  const firstDateOfWeekMS = dateMidnightMS - MS_IN_DAY * new Date(dateMidnightMS).getDay();
  let topEl = 0;

  const prevEvents = props.events.filter(val => val.startDate < ev.startDate
    && val.endDate > dateMidnightMS
    && (val.startDate < dateMidnightMS || val.endDate > dateMidnightMS + MS_IN_DAY));

  const elem = prevEvents[prevEvents.length - 1];
  let id;

  if (elem && elem.startDate >= firstDateOfWeekMS) {
    const date = new Date(elem.startDate);
    id = `${elem.id}-${new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()}`;
  } else if (elem && elem.startDate < firstDateOfWeekMS) {
    id = `${elem.id}-${firstDateOfWeekMS}`;
  }

  if (elem && document.getElementById(id)) {
    const coordsStart = getCoords(document.getElementById(id).parentElement.parentElement);
    const coordsEl = getCoords(document.getElementById(id));

    topEl = coordsEl.bottom - coordsStart.top - 2;
  }
  return topEl;
}

function getElementPosition(props) {
  let heightEl = 0;
  let leftEl = 0;
  let topEl = 0;
  const { dateMidnightMS } = props;
  const ev = props.currEvent;

  if (
    (props.period === 'day' || props.period === 'week')
    && ev.startDate > dateMidnightMS
    && ev.endDate < dateMidnightMS + MS_IN_DAY
  ) {
    heightEl = getElementHeight(props);
    leftEl = getElementLeftShift(props);
  }

  if (props.period === 'week'
        && new Date(dateMidnightMS).getDay() !== 0
        && (ev.startDate === dateMidnightMS
        && ev.endDate === dateMidnightMS + MS_IN_DAY
        || ev.startDate < dateMidnightMS
        || ev.endDate > dateMidnightMS + MS_IN_DAY)) {
    topEl = getElementTopShift(props);
  }

  return {
    heightEl,
    leftEl,
    topEl,
  };
}


function getBlockTopShift(arrOfEvents, firstDateOfWeekMS) {
  const arr = arrOfEvents.map((value, index) =>
    value[0].filter(v => v.startDate < firstDateOfWeekMS + index * MS_IN_DAY));

  const arrTopEl = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];

  return arrTopEl.map((val, ind) => {
    const elem = arr[ind][arr[ind].length - 1];
    let index;

    if (elem && ind > 0) {
      const dateMS = new Date(
        new Date(elem.startDate).getFullYear(), new Date(elem.startDate).getMonth(),
        new Date(elem.startDate).getDate()
      ).getTime();

      const dayOfWeek = (dateMS - firstDateOfWeekMS) / MS_IN_DAY;
      const indDay = dayOfWeek > 0 ? dayOfWeek : 0;

      const el = arrOfEvents[indDay][0].filter(v => v.id === elem.id);

      index = arrOfEvents[indDay][0].indexOf(el[0]) + 1;
    } else {
      index = 0;
    }

    return index;
  });
}


function getStartDateStrAndCoefWidth(currEvent, index, dateMidnightMS) {
  const startDateMS = currEvent.startDate;
  const endDateMS = currEvent.endDate;
  const startDate = new Date(currEvent.startDate);
  const endDate = new Date(currEvent.endDate);
  const startDateMidnightMS = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  ).getTime();

  const endDateMidnightMS = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  ).getTime();

  let startTimeStr;
  let coefWidth;

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
  if (endDateMS === endDateMidnightMS) coefWidth -= 1;
  if (coefWidth > 7) coefWidth = 7;
  if (coefWidth > 6 - index + 1) coefWidth = 6 - index + 1;

  return {
    startDateStr: startTimeStr,
    coefWidth,
  };
}

export { getElementPosition, getBlockTopShift, getStartDateStrAndCoefWidth,
  getDateStr, getTimeStr };
