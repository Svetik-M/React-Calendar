import React from 'react';
import PropTypes from 'prop-types';

import SelectedPeriod from './selected-period';

function TitleMenu(props) {
  return (
    <div className="header">
      <div className="logo">My Calendar</div>
      <div className="menu">
        <div className="title-menu">
          <div className="nav-today" id="today">Today</div>
          <div className="nav">
            <div>
              <i className="fa fa-arrow-circle-left" aria-hidden="true" id="prev-period" />
            </div>
            <SelectedPeriod selDate={props.selDate} period={props.period} />
            <div>
              <i className="fa fa-arrow-circle-right" aria-hidden="true" id="next-period" />
            </div>
          </div>
          <ul className="period-block">
            <li className="period" id="day">Day</li>
            <li className="period" id="week">Week</li>
            <li className="period" id="month">Month</li>
          </ul>

        </div>
      </div>
      <div>
        <a className="logout" href="/logout">Log Out</a>
      </div>
    </div>
  );
}

TitleMenu.propTypes = {
  selDate: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
};

export default TitleMenu;
