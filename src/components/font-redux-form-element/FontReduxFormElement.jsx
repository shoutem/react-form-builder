import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import Select from 'react-select';
import t from '../../i18n';
import LOCALIZATION from '../../localization';
import { BaseColorPicker } from '../color-redux-form-element';
import { fieldInError } from '../services';
import {
  FONT_FAMILY_OPTIONS,
  FONT_STYLE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  FONT_SIZE_STEP,
} from './defaultValues';
import './style.scss';

function generateSelectOptions(constraints, localization) {
  const options = _.get(constraints, 'enum', constraints);

  return _.map(options, option => ({
    value: option,
    label: _.startCase(t(option, localization)),
  }));
}

export default class FontReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    field: PropTypes.object,
    helpText: PropTypes.string,
    fontFamilyOptions: PropTypes.array,
    fontStyleOptions: PropTypes.array,
    fontWeightOptions: PropTypes.array,
    fontSizeOptions: PropTypes.array,
    fontSizeContstraints: PropTypes.object,
    localization: PropTypes.object,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    const {
      fontSizeContstraints,
      fontFamilyContstraints,
      fontStyleContstraints,
      fontWeightContstraints,
      localization,
    } = props;

    const minFontSize = _.get(fontSizeContstraints, 'minimum', MIN_FONT_SIZE);
    const maxFontSize = _.get(fontSizeContstraints, 'maximum', MAX_FONT_SIZE);
    const fontSizeStep = _.get(
      fontSizeContstraints,
      'fontSizeStep',
      FONT_SIZE_STEP,
    );
    const fontSizeValues = _.range(minFontSize, maxFontSize + 1, fontSizeStep);

    this.state = {
      fontFamilyOptions: generateSelectOptions(
        fontFamilyContstraints || FONT_FAMILY_OPTIONS,
        localization,
      ),
      fontStyleOptions: generateSelectOptions(
        fontStyleContstraints || FONT_STYLE_OPTIONS,
        localization,
      ),
      fontWeightOptions: generateSelectOptions(
        fontWeightContstraints || FONT_WEIGHT_OPTIONS,
        localization,
      ),
      fontSizeOptions: generateSelectOptions(fontSizeValues, localization),
    };
  }

  handleChange(item, valueKey) {
    const { field } = this.props;
    const value = _.get(item, 'value');

    const newValue = {
      ...field.value,
      [valueKey]: value,
    };

    field.onChange(newValue);
  }

  renderSelector(valueKey, options, size) {
    const { field, localization } = this.props;

    return (
      <FormGroup style={{ flex: size, paddingRight: 24 }}>
        <Select
          value={_.get(field, ['value', valueKey])}
          onChange={value => this.handleChange(value, valueKey)}
          placeholder={t(
            LOCALIZATION.DROPDOWN_EMPTY_PLACEHOLDER_LABEL,
            localization,
          )}
          options={options}
          clearable={false}
        />
      </FormGroup>
    );
  }

  render() {
    const { elementId, name, field, helpText } = this.props;
    const {
      fontFamilyOptions,
      fontStyleOptions,
      fontWeightOptions,
      fontSizeOptions,
    } = this.state;

    const isError = fieldInError(field);
    const helpBlockText = isError ? field.error : helpText;

    return (
      <FormGroup
        className="font-redux-form-element"
        controlId={elementId}
        validationState={isError ? 'error' : 'success'}
      >
        <ControlLabel>{name}</ControlLabel>
        <div className="forms-container">
          {this.renderSelector('fontFamily', fontFamilyOptions, 2)}
          {this.renderSelector('fontStyle', fontStyleOptions, 2)}
          {this.renderSelector('fontWeight', fontWeightOptions, 2)}
          {this.renderSelector('fontSize', fontSizeOptions, 1)}
          <FormGroup>
            <BaseColorPicker
              onChange={value => this.handleChange(value, 'color')}
              value={_.get(field, 'value.color')}
            />
          </FormGroup>
        </div>
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}
