import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import { fieldInError } from '../services';
import BaseColorPicker from './color-picker';

export default function ColorReduxFormElement({
  elementId,
  field,
  name,
  className,
  helpText,
  localization,
  ...otherProps
}) {
  const classes = classNames('color-redux-from-element', className);
  const isError = fieldInError(field);
  const helpBlockText = isError ? field.error : helpText;

  return (
    <FormGroup
      className={classes}
      controlId={elementId}
      validationState={isError ? 'error' : 'success'}
    >
      <ControlLabel>{name}</ControlLabel>
      <BaseColorPicker
        onChange={field.onChange}
        value={field.value}
        localization={localization}
        displayColorValue
        {...otherProps}
      />
      {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
    </FormGroup>
  );
}

ColorReduxFormElement.propTypes = {
  elementId: PropTypes.string,
  name: PropTypes.string,
  field: PropTypes.object,
  className: PropTypes.string,
  helpText: PropTypes.string,
  localization: PropTypes.object,
};
