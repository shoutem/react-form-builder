import { isURL } from 'validator';
import _ from 'lodash';
import {
  PROPERTY_TYPES,
  PROPERTY_FORMATS,
  PROPERTY_REFERENCED_SCHEMAS,
} from '../const';
import t from '../i18n';
import LOCALIZATION from '../localization';
import {
  getEditorSections,
  getSectionPropertyKey,
  getSchemaProperty,
} from './schema';

function validateRequiredField(fieldValue, localization) {
  if (!fieldValue) {
    return t(LOCALIZATION.VALUE_REQUIRED_MESSAGE, localization);
  }

  return null;
}

function validateNumericField(fieldValue, localization) {
  const numberValue = _.toNumber(fieldValue);

  if (_.isNaN(numberValue)) {
    return t(LOCALIZATION.INVALID_NUMBER_MESSAGE, localization);
  }

  return null;
}

function validateMinimumNumberField(fieldValue, minimum) {
  const numberValue = _.toNumber(fieldValue);

  if (numberValue < minimum) {
    return true;
  }

  return null;
}

function validateMaximumNumberField(fieldValue, maximum) {
  const numberValue = _.toNumber(fieldValue);

  if (numberValue > maximum) {
    return true;
  }

  return null;
}

function validateMinLengthField(fieldValue, minLength, localization) {
  const stringValue = _.toString(fieldValue);

  // TODO min length
  if (!stringValue || stringValue.length < minLength) {
    return t(LOCALIZATION.INVALID_MIN_LENGTH_MESSAGE, localization, {
      minLength,
    });
  }

  return null;
}

function validateUrl(fieldValue, localization) {
  if (fieldValue && !isURL(fieldValue)) {
    return t(LOCALIZATION.INVALID_URL_MESSAGE, localization);
  }

  return null;
}

function validatePattern(fieldValue, pattern) {
  if (!fieldValue) {
    return null;
  }

  const regex = new RegExp(pattern);
  const match = regex.test(fieldValue);

  if (!match) {
    return true;
  }

  return null;
}

function validateProperty(schemaProperty, field, options) {
  const localization = _.get(options, 'localization');
  const minLength = _.get(schemaProperty, 'minLength');
  const pattern = _.get(schemaProperty, 'pattern');
  const required = _.get(schemaProperty, 'required');
  const format = _.get(schemaProperty, 'format');

  if (required) {
    if (schemaProperty.type === PROPERTY_TYPES.OBJECT) {
      // check if video and photo object has url
      if (
        schemaProperty.referencedSchema ===
          PROPERTY_REFERENCED_SCHEMAS.VIDEO_ATTACHMENT ||
        schemaProperty.referencedSchema ===
          PROPERTY_REFERENCED_SCHEMAS.IMAGE_ATTACHMENT
      ) {
        const url = _.get(field, 'url');
        const error = validateRequiredField(url, localization);

        if (error) {
          return error;
        }
      }

      if (schemaProperty.format === PROPERTY_FORMATS.ENTITY_REFERENCE) {
        const id = _.get(field, 'id');
        const error = validateRequiredField(id);

        if (error) {
          return error;
        }
      }
    }

    const error = validateRequiredField(field);
    if (error) {
      return error;
    }
  }

  if (minLength) {
    const error = validateMinLengthField(field, minLength, localization);
    if (error) {
      return error;
    }
  }

  if (pattern) {
    const error = validatePattern(field, pattern);
    if (error) {
      return error;
    }
  }

  if (format === PROPERTY_FORMATS.URI && !pattern) {
    const error = validateUrl(field, localization);
    if (error) {
      return error;
    }
  }

  if (
    format === PROPERTY_FORMATS.INTEGER ||
    format === PROPERTY_FORMATS.NUMBER
  ) {
    const error = validateNumericField(field, localization);
    if (error) {
      return error;
    }

    if (_.has(schemaProperty, 'minimum')) {
      const error = validateMinimumNumberField(field, schemaProperty.minimum);
      if (error) {
        return error;
      }
    }

    if (_.has(schemaProperty, 'maximum')) {
      const error = validateMaximumNumberField(field, schemaProperty.maximum);
      if (error) {
        return error;
      }
    }
  }

  return null;
}

export function validateResourceForm(schema, form, options) {
  const sections = getEditorSections(schema);
  const errors = {};

  _.forEach(sections, section => {
    _.forEach(section.properties, sectionProperty => {
      const propertyKey = getSectionPropertyKey(sectionProperty);
      const schemaProperty = getSchemaProperty(schema, propertyKey);

      if (schemaProperty) {
        const field = _.get(form, propertyKey);
        const error = validateProperty(schemaProperty, field, options);

        if (error) {
          _.set(errors, propertyKey, error);
        }
      }
    });
  });

  return errors;
}
