import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { reduxForm } from 'redux-form';
import { resolveFormState } from '../../redux';
import {
  resolveIsArrayPropertiesChanged,
  resolveSchemaElements,
  validateResourceForm,
  getFormPropertyKeys,
} from '../../services';

function ResourceForm({
  className,
  schema,
  canonicalName,
  assetManager,
  submitting,
  pristine,
  fields,
  touch,
  loadSchema,
  loadResources,
  googleApiKey,
  unsplashAccessKey,
  handleSubmit,
  ownInitialValues,
  values,
  error,
  localization,
  renderHeader,
  renderFooter,
}) {
  const options = {
    assetManager,
    canonicalName,
    googleApiKey,
    unsplashAccessKey,
    touch,
    loadSchema,
    loadResources,
    localization,
  };

  // needs to be calculated again, as error prop is not returing validation errors
  // fixed in v6 redux-form, but we are using v5
  const validationErrors = validateResourceForm(schema, values, options);

  // needs to be calculated manually, as touch or pristine don't work for arrays
  // fixed in v6 redux-form, but we are using v5
  const arrayChanged = resolveIsArrayPropertiesChanged(
    schema,
    values,
    ownInitialValues,
  );
  const dirty = !pristine || arrayChanged;
  const disabled = submitting || !dirty || !_.isEmpty(validationErrors);

  const elements = resolveSchemaElements(schema, fields, options);

  const formProps = {
    dirty,
    disabled,
    submitting,
    error,
    validationErrors,
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      {_.isFunction(renderHeader) && renderHeader(formProps)}
      {elements}
      {_.isFunction(renderFooter) && renderFooter(formProps)}
    </form>
  );
}

ResourceForm.propTypes = {
  className: PropTypes.func,
  schema: PropTypes.object,
  values: PropTypes.object,
  canonicalName: PropTypes.string,
  googleApiKey: PropTypes.string,
  unsplashAccessKey: PropTypes.string,
  assetManager: PropTypes.object,
  ownInitialValues: PropTypes.func,
  handleSubmit: PropTypes.func,
  loadSchema: PropTypes.func,
  loadResources: PropTypes.func,
  touch: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  fields: PropTypes.object,
  error: PropTypes.string,
  renderHeader: PropTypes.func,
  renderFooter: PropTypes.func,
  localization: PropTypes.object,
};

export function resolveForm(schema, options) {
  const propertyKeys = getFormPropertyKeys(schema);
  const formKey = _.get(options, 'formKey') || 'resourceForm';
  const reducerKey = _.get(options, 'reducerKey') || 'reactFormBuilder';

  return reduxForm({
    getFormState: resolveFormState(reducerKey),
    form: formKey,
    fields: ['id', ...propertyKeys],
    validate: resource => validateResourceForm(schema, resource, options),
    ...options,
  })(ResourceForm);
}
