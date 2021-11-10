import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { RichTextEditor } from '@shoutem/react-web-ui';
import _ from 'lodash';
import LOCALIZATION from '../../localization';
import t from '../../i18n';
import './style.scss';

export default class ArrayTextEditorFormItem extends Component {
  static propTypes = {
    index: PropTypes.number,
    field: PropTypes.object,
    elementId: PropTypes.string,
    onRemove: PropTypes.func,
    unsplashAccessKey: PropTypes.string,
    localization: PropTypes.object,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleRemoveField() {
    const { index, onRemove } = this.props;

    if (_.isFunction(onRemove)) {
      onRemove(index);
    }
  }

  handleChange(value) {
    const { field } = this.props;
    field.onChange(value.toString('html'));
  }

  render() {
    const {
      field,
      unsplashAccessKey,
      localization,
      ...otherProps
    } = this.props;
    const value = _.get(field, 'value', '');

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
      <div className="array-text-editor-form-item-container">
        <div className="remove-btn" onClick={this.handleRemoveField}>
          {t(LOCALIZATION.REMOVE_SECTION, localization)}
        </div>
        <div className="editor">
          <RichTextEditor
            {...otherProps}
            onChange={this.handleChange}
            value={value}
            imagePickerLocalization={imagePickerLocalization}
            imagePickerOptions={{ unsplashAccessKey }}
          />
        </div>
      </div>
    );
  }
}
