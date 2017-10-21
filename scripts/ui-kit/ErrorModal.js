import React from 'react';
import PropTypes from 'prop-types';

import labelsUtil from '../utils/labelsUtil';

function ErrorModal(props) {
  const errorMessage = labelsUtil(props.message)
    .split('\n')
    .map((line, index) => (<div key={index}>{line}</div>));

  // TODO: Rewrite classes according to BEM methodology
  return (
    <div className="incorrect">
      <div>
        <i className="fa fa-times" onClick={props.onClose} />
        <div>
          <i className="fa fa-exclamation-triangle" />
          {errorMessage}
        </div>
      </div>
    </div>
  );
}

ErrorModal.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorModal;
