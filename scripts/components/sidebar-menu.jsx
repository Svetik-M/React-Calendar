import React from 'react';
import PropTypes from 'prop-types';

import CalendarWidget from './calendar-widget';

function SidebarMenu(props) {
  return (
    <div className="sidebar-menu">
      <div className="create-event">
        <button><i className="fa fa-plus-circle" aria-hidden="true" /> Create event</button>
      </div>
      <CalendarWidget selDate={props.selDate} period={props.period} />
    </div>
  );
}

SidebarMenu.propTypes = {
  selDate: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
};

export default SidebarMenu;
