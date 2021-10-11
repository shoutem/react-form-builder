import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { HelpBlock, ControlLabel, FormGroup } from 'react-bootstrap';
import { RichTextEditor } from '@shoutem/react-web-ui';
import t from '../../i18n';
import LOCALIZATION from '../../localization';
import { fieldInError } from '../services';
import './style.scss';

export default class TextEditorReduxFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    name: PropTypes.string,
    field: PropTypes.object,
    helpText: PropTypes.string,
    className: PropTypes.string,
    unsplashAccessKey: PropTypes.string,
    localization: PropTypes.object,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleChange(value) {
    const { field } = this.props;
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
      localization,
      ...otherProps
    } = this.props;
    const { value } = _.get(field, 'value', '');

    const classes = classNames('text-editor-redux-from-element', className);
    const isError = fieldInError(field);
    const helpBlockText = isError ? field.error : helpText;
    const imagePickerLocalization = {
      footerText: t(LOCALIZATION.IMAGE_PICKER_FOOTER_TEXT, localization),
      insertButtonTextSingular: t(
        LOCALIZATION.IMAGE_PICKER_INSERT_BUTTON_TEXT_SINGULAR,
        localization,
      ),
      insertButtonTextPlural: t(
        LOCALIZATION.IMAGE_PICKER_INSERT_BUTTON_TEXT_PLURAL,
        localization,
      ),
      invalidUnsplashKeyText: t(
        LOCALIZATION.IMAGE_PICKER_INVALID_ACCESS_KEY_TEXT,
        localization,
      ),
      modalTitle: t(LOCALIZATION.IMAGE_PICKER_MODAL_TITLE, localization),
      imagePreviewOnText: t(LOCALIZATION.IMAGE_PICKER_ON_TEXT, localization),
      imagePreviewPhotoByText: t(
        LOCALIZATION.IMAGE_PICKER_PHOTO_BY_TEXT,
        localization,
      ),
      imagePreviewUnsplashText: t(
        LOCALIZATION.IMAGE_PICKER_UNSPLASH_TEXT,
        localization,
      ),
      searchPlaceholder: t(
        LOCALIZATION.IMAGE_PICKER_SEARCH_PLACEHOLDER,
        localization,
      ),
      searchTabTitle: t(
        LOCALIZATION.IMAGE_PICKER_SEARCH_TAB_TITLE,
        localization,
      ),
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
