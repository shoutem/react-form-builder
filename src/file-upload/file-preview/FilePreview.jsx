import React from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import Uri from 'urijs';
import classnames from 'classnames';
import { FontIcon } from '@shoutem/react-web-ui';
import t from '../../i18n';
import LOCALIZATION from '../../localization';
import './style.scss';

export default class FilePreview extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    onDeleteClick: PropTypes.func,
    canBeDeleted: PropTypes.bool,
    localization: PropTypes.object,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleClick(event) {
    event.stopPropagation();
  }

  render() {
    const {
      src,
      className,
      canBeDeleted,
      onDeleteClick,
      localization,
    } = this.props;

    const filename = src
      ? new Uri(src).filename()
      : t(LOCALIZATION.NO_FILE, localization);

    const classes = classnames(className, 'file-preview', {
      'is-deletable': canBeDeleted,
    });

    return (
      <div className={classes} onClick={this.handleClick}>
        <div>
          <FontIcon name="file-uploaded" size="24px" />
          <div>{filename}</div>
        </div>
        {canBeDeleted && (
          <FontIcon
            name="delete"
            onClick={onDeleteClick}
            className="file-preview__delete"
          />
        )}
      </div>
    );
  }
}
