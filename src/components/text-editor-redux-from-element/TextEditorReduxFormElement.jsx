import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HelpBlock, ControlLabel, FormGroup } from 'react-bootstrap';
import { RichTextEditor } from '@shoutem/react-web-ui';
import { fieldInError } from '../services';
import LOCALIZATION from '../../localization';
import './style.scss';

export default class TextEditorReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    field: PropTypes.object,
    helpText: PropTypes.string,
    className: PropTypes.string,
    unsplashAccessKey: PropTypes.string,
  };

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
    field.onChange(value.toString('html'));
  }

  render() {
    const {
      elementId,
      field,
      name,
      helpText,
      className,
      unsplashAccessKey,
      ...otherProps
    } = this.props;
    const { value } = this.state;

    const classes = classNames('text-editor-redux-from-element', className);
    const isError = fieldInError(field);
    const helpBlockText = isError ? field.error : helpText;
    const imagePickerLocalization = {
      footerText: i18next.t(LOCALIZATION.IMAGE_PICKER_FOOTER_TEXT),
      insertButtonTextSingular: i18next.t(
        LOCALIZATION.IMAGE_PICKER_INSERT_BUTTON_TEXT_SINGULAR,
      ),
      insertButtonTextPlural: i18next.t(
        LOCALIZATION.IMAGE_PICKER_INSERT_BUTTON_TEXT_PLURAL,
      ),
      invalidUnsplashKeyText: i18next.t(
        LOCALIZATION.IMAGE_PICKER_INVALID_ACCESS_KEY_TEXT,
      ),
      modalTitle: i18next.t(LOCALIZATION.IMAGE_PICKER_MODAL_TITLE),
      imagePreviewOnText: i18next.t(LOCALIZATION.IMAGE_PICKER_ON_TEXT),
      imagePreviewPhotoByText: i18next.t(
        LOCALIZATION.IMAGE_PICKER_PHOTO_BY_TEXT,
      ),
      imagePreviewUnsplashText: i18next.t(
        LOCALIZATION.IMAGE_PICKER_UNSPLASH_TEXT,
      ),
      searchPlaceholder: i18next.t(
        LOCALIZATION.IMAGE_PICKER_SEARCH_PLACEHOLDER,
      ),
      searchTabTitle: i18next.t(LOCALIZATION.IMAGE_PICKER_SEARCH_TAB_TITLE),
    };

    return (
      <FormGroup
        className={classes}
        controlId={elementId}
        validationState={isError ? 'error' : 'success'}
      >
        <ControlLabel>{name}</ControlLabel>
        <RichTextEditor
          imagePickerLocalization={imagePickerLocalization}
          imagePickerOptions={{ unsplashAccessKey }}
          onChange={this.handleChange}
          value={value}
          {...otherProps}
        />
        {helpBlockText && <HelpBlock>{helpBlockText}</HelpBlock>}
      </FormGroup>
    );
  }
}
