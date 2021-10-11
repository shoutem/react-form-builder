import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FontIcon } from '@shoutem/react-web-ui';
import t from '../../i18n';
import LOCALIZATION from '../../localization';
import './style.scss';

export default function FileUploadPlaceholder({ className, localization }) {
  const classes = classnames('file-upload-placeholder', className);

  return (
    <div className={classes}>
      <div>
        <FontIcon name="add" />
        <div>{t(LOCALIZATION.FILE_UPLOAD_MESSAGE, localization)}</div>
      </div>
    </div>
  );
}

FileUploadPlaceholder.propTypes = {
  className: PropTypes.string,
  localization: PropTypes.object,
};
