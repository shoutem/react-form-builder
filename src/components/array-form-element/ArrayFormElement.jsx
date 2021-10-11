import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { FontIcon } from '@shoutem/react-web-ui';
import LOCALIZATION from '../../localization';
import t from '../../i18n';
import './style.scss';

export default class ArrayFormElement extends Component {
  static propTypes = {
    elementId: PropTypes.string,
    element: PropTypes.node,
    name: PropTypes.string,
    field: PropTypes.object,
    ItemComponent: PropTypes.object,
    localization: PropTypes.object,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    const { field } = props;

    // add empty field if there is no fields
    if (_.isEmpty(field)) {
      field.addField();
    }
  }

  handleRemoveField(index) {
    const { field } = this.props;

    if (field) {
      field.removeField(index);
      _.set(field, 'touched', true);
    }
  }

  handleAddField() {
    const { field } = this.props;

    if (field) {
      field.addField();
    }
  }

  render() {
    const {
      ItemComponent,
      name,
      elementId,
      field,
      localization,
      ...otherProps
    } = this.props;

    return (
      <FormGroup className="array-form" controlId={elementId}>
        <ControlLabel>{name}</ControlLabel>
        <div className="fields-container">
          {_.map(field, (fieldItem, index) => (
            <ItemComponent
              index={index}
              field={fieldItem}
              elementId={_.get(fieldItem, 'name')}
              onRemove={this.handleRemoveField}
              {...otherProps}
            />
          ))}
        </div>
        <div className="add-more">
          <div className="add-more-container" onClick={this.handleAddField}>
            <FontIcon className="add-more-icon" name="add" size={25} />
            <div className="add-more-text">
              {t(LOCALIZATION.ADD_MORE, localization)}
            </div>
          </div>
        </div>
      </FormGroup>
    );
  }
}
