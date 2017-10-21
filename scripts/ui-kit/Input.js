import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import labelsUtil from '../utils/labelsUtil';
import * as validator from '../utils/validator';

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };

    this.onHandleBlur = this.onHandleBlur.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
  }

  onHandleBlur(e) {
    const { value, name } = e.target;
    const { error } = validator[name](value);

    this.setState({ error });
  }

  onHandleChange(e) {
    const { value, name } = e.target;
    const { isValid, error } = validator[name](value);

    if (!error) {
      this.setState({ error });
    }

    this.props.onChange(name, value, isValid);
  }

  validateField(value, name, showError) {
    const { isValid, error } = validator[name](value);

    this.setState(() => (showError || !error ? { isValid, error } : { isValid }));
  }

  render() {
    // TODO: Remove this.props.name and error from class list
    const inputClasses = classNames(
      this.props.name,
      { error: this.state.error }
    );

    const componentClasses = classNames('input', this.props.className);

    const icon = this.props.icon ? <i className={`fa ${this.props.icon}`} /> : null;

    // TODO: Rewrite classes according to BEM methodology
    return (
      <div className={componentClasses}>
        <label>
          {icon}
          <input
            type={this.props.type}
            name={this.props.name}
            className={inputClasses}
            onBlur={this.onHandleBlur}
            onChange={this.onHandleChange}
            value={this.props.value}
            placeholder={labelsUtil(this.props.placeholder)}
          />
        </label>
        <div className="err">{labelsUtil(this.state.error)}</div>
      </div>
    );
  }
}

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

Input.defaultProps = {
  type: 'text',
  placeholder: '',
  icon: '',
  className: '',
};

export default Input;
