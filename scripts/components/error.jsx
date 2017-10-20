import React from 'react';
import PropTypes from 'prop-types';

function Error(props) {
  return (
    <div className={`connection-error${props.visible ? '' : ' none'}`}>
      <div>
        <i className="fa fa-times" aria-hidden="true" />
        <div>
          <i className="fa fa-exclamation-triangle" aria-hidden="true" />
            Internal server or database error.<br />
            Please try again later
        </div>
      </div>
    </div>
  );
}

Error.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default Error;
