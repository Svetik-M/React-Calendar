import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getElementPosition } from '../viewing-options';

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heightEl: 0,
      leftEl: 0,
      topEl: 0,
    };
  }

  componentWillMount() {
    const state = getElementPosition(this.props);
    this.setState(state);
  }

  componentWillReceiveProps(nextProps) {
    const state = getElementPosition(nextProps);
    this.setState(state);
  }

  render() {
    const ev = this.props.currEvent;
    let divStyle;

    if (this.state.heightEl > 0) {
      divStyle = {
        height: `${this.state.heightEl}px`,
        left: `${this.state.leftEl}px`,
      };
    } else {
      divStyle = {
        height: `${20}px`,
        left: `${this.state.leftEl}px`,
      };
    }

    if (this.props.coefWidth) {
      let coef = this.props.coefWidth === 2 || this.props.coefWidth === 3 ? -1 :
        this.props.coefWidth === 4 && 1 || 0;

      coef += (this.props.coefWidth - 1) * 4.5 + 4 - 6;
      divStyle.width = `calc(${this.props.coefWidth * 100}% + ${coef}px)`;

      if (this.state.topEl) divStyle.top = `${this.state.topEl}px`;
    }

    return (
      <div>
        <div
          id={`${ev.id}-${this.props.dateMidnightMS}`}
          className={`event ${ev.category}`}
          data-start={ev.startDate}
          style={divStyle}
        >
          {`${this.props.startDateStr} ${ev.title}`}
        </div>
      </div>

    );
  }
}

Event.propTypes = {
  currEvent: PropTypes.object.isRequired,
  coefWidth: PropTypes.number.isRequired,
  dateMidnightMS: PropTypes.number.isRequired,
  startDateStr: PropTypes.string.isRequired,
};

export default Event;
