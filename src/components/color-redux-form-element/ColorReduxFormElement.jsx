import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import i18next from 'i18next';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { fieldInError } from '../services';
import BaseColorPicker from './color-picker';

export default class ColorReduxFormElement extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { field } = props;
    const initialValue = _.get(field, 'value', '');

    this.state = {
      value: initialValue,
    };
  }

  handleChange(value) {
    const { field } = this.props;

    this.setState({ value });
    field.onChange(value);
  }

  render() {
    const { elementId, field, name, className, ...otherProps } = this.props;
    const { value } = this.state;

    const classes = classNames('color-redux-from-element', className);
    const isError = fieldInError(field);

    return (
      <FormGroup
        className={classes}
        controlId={elementId}
        validationState={isError ? 'error' : 'success'}
      >
        <ControlLabel>{i18next.t(name)}</ControlLabel>
        <BaseColorPicker
          onChange={this.handleChange}
          name={name}
          value={value}
          displayColorValue
          {...otherProps}
        />
      </FormGroup>
    );
  }
}

ColorReduxFormElement.propTypes = {
  elementId: PropTypes.string,
  name: PropTypes.string,
  field: PropTypes.object,
  className: PropTypes.string,
};
