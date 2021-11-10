import _ from 'lodash';
import React from 'react';
import { ReduxFormElement } from '@shoutem/react-web-ui';
import {
  GalleryReduxFormElement,
  ArrayFormElement,
  ArrayReduxFormItem,
  ArrayTextEditorFormItem,
  ImageUploaderReduxFormElement,
  VideoUploaderReduxFormElement,
  GeolocationReduxFormElement,
  DateTimeReduxFormElement,
  TextEditorReduxFormElement,
  TextAreaReduxFormElement,
  EntityReferenceReduxFormElement,
  BooleanReduxFormElement,
  ColorReduxFormElement,
  FontReduxFormElement,
  SelectReduxFormElement,
  FormContainer,
  SectionForm,
} from '../components';
import {
  PROPERTY_TYPES,
  PROPERTY_FORMATS,
  PROPERTY_REFERENCED_SCHEMAS,
} from '../const';
import t from '../i18n';
import LOCALIZATION from '../localization';
import {
  getEditorSize,
  getEditorSections,
  getSchemaPropertyKeys,
  getSchemaProperty,
  getSectionPropertyKey,
  getSchemaPropertyEnum,
  getSchemaPropertyContstraints,
} from './schema';

export function resolveObjectOptions(options, valueKey, localization) {
  return _.map(options, option => {
    return {
      value: { [valueKey]: option },
      label: _.startCase(t(option, localization)),
    };
  });
}

export function resolveTimezoneKey(key) {
  return `${key}TimezoneId`;
}

export function fieldInError(formField) {
  return formField.touched && formField.error;
}

export function getFormPropertyKeys(schema) {
  const propertyKeys = getSchemaPropertyKeys(schema);
  const formKeys = [];

  _.forEach(propertyKeys, propertyKey => {
    const property = getSchemaProperty(schema, propertyKey);

    if (property.format === PROPERTY_FORMATS.ENTITY_REFERENCE_ARRAY) {
      formKeys.push(`${propertyKey}[]`);
      return;
    }

    if (property.type === PROPERTY_TYPES.ARRAY) {
      formKeys.push(`${propertyKey}[]`);
      return;
    }

    if (property.format === PROPERTY_FORMATS.DATE_TIME) {
      // add timezone form key as an extra
      formKeys.push(resolveTimezoneKey(propertyKey));
    }

    formKeys.push(propertyKey);
  });

  return formKeys;
}

export function resolveReactComponent(Component, props = {}) {
  if (!Component) {
    return null;
  }

  if (React.isValidElement(Component)) {
    return React.cloneElement(Component, props);
  }

  return <Component {...props} />;
}

export function mapViewToModel(schema, resource) {
  const model = {};

  if (!schema) {
    return model;
  }

  _.forOwn(schema.properties, (value, key) => {
    const resourceValue = _.get(resource, key);
    const propertyType = _.get(value, 'type');
    const propertyFormat = _.get(value, 'format');

    // add timezone as an extra for date time property
    if (propertyFormat === PROPERTY_FORMATS.DATE_TIME) {
      const timezoneValue = _.get(resource, resolveTimezoneKey(key));
      _.set(model, resolveTimezoneKey(key), timezoneValue);
    }

    switch (propertyType) {
      case PROPERTY_TYPES.STRING:
        _.set(model, key, _.toString(resourceValue));
        break;
      case PROPERTY_TYPES.INTEGER:
        _.set(model, key, _.toNumber(resourceValue));
        break;
      case PROPERTY_TYPES.NUMBER:
        _.set(model, key, _.toNumber(resourceValue));
        break;
      case PROPERTY_TYPES.ARRAY:
        // remove empty values from array
        // eslint-disable-next-line no-case-declarations
        const newResourceValue = _.reduce(
          resourceValue,
          (result, item) => {
            if (!_.isEmpty(item)) {
              result.push(item);
              return result;
            }

            return result;
          },
          [],
        );

        _.set(model, key, newResourceValue);
        break;
      default:
        _.set(model, key, resourceValue);
    }
  });

  return model;
}

export function mapModelToView(schema, resource) {
  const view = {};

  if (!schema) {
    return view;
  }

  _.forOwn(schema.properties, (value, key) => {
    const resourceValue = _.get(resource, key);
    const propertyType = _.get(value, 'type');
    const propertyFormat = _.get(value, 'format');

    // add timezone as an extra for date time property
    if (propertyFormat === PROPERTY_FORMATS.DATE_TIME) {
      const timezoneValue = _.get(resource, resolveTimezoneKey(key));
      _.set(view, resolveTimezoneKey(key), timezoneValue);
    }

    switch (propertyType) {
      case PROPERTY_TYPES.STRING:
        _.set(view, key, _.toString(resourceValue));
        break;
      default:
        _.set(view, key, resourceValue);
    }
  });

  return view;
}

export function resolveFormElement(sectionProperty, schema, fields, options) {
  const propertyKey = getSectionPropertyKey(sectionProperty);
  const schemaProperty = getSchemaProperty(schema, propertyKey);

  if (!schemaProperty) {
    return null;
  }

  const localization = _.get(options, 'localization');
  const propertyField = _.get(fields, propertyKey);
  const propertyTitle = t(schemaProperty.title, localization);

  if (
    schemaProperty.type === PROPERTY_TYPES.ARRAY &&
    schemaProperty.format === PROPERTY_FORMATS.ARRAY
  ) {
    const props = {
      ItemComponent: ArrayReduxFormItem,
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      localization,
    };
    return resolveReactComponent(ArrayFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.ARRAY &&
    schemaProperty.format === PROPERTY_FORMATS.HTML
  ) {
    const props = {
      ItemComponent: ArrayTextEditorFormItem,
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      maxLength: schemaProperty.maxLength,
      unsplashAccessKey: options.unsplashAccessKey,
      localization,
    };
    return resolveReactComponent(ArrayFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.STRING &&
    schemaProperty.format === PROPERTY_FORMATS.COLOR
  ) {
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      localization,
    };
    return resolveReactComponent(ColorReduxFormElement, props);
  }

  if (schemaProperty.type === PROPERTY_TYPES.STRING) {
    if (schemaProperty.format === PROPERTY_FORMATS.HTML) {
      const props = {
        elementId: propertyKey,
        field: propertyField,
        name: propertyTitle,
        maxLength: schemaProperty.maxLength,
        unsplashAccessKey: options.unsplashAccessKey,
        localization,
      };
      return resolveReactComponent(TextEditorReduxFormElement, props);
    }

    if (schemaProperty.format === PROPERTY_FORMATS.MULTI_LINE) {
      const props = {
        elementId: propertyKey,
        field: propertyField,
        name: propertyTitle,
        maxLength: schemaProperty.maxLength,
        localization,
      };
      return resolveReactComponent(TextAreaReduxFormElement, props);
    }

    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      maxLength: schemaProperty.maxLength,
      enableEmojiPicker: true,
      localization,
    };
    return resolveReactComponent(ReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.OBJECT &&
    schemaProperty.format === PROPERTY_FORMATS.DROPDOWN
  ) {
    const valueKey = 'dropdownValue';
    const enumOptions = getSchemaPropertyEnum(schema, propertyKey, valueKey);
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      placeholder: t(
        LOCALIZATION.DROPDOWN_EMPTY_PLACEHOLDER_LABEL,
        localization,
      ),
      options: resolveObjectOptions(enumOptions, valueKey, localization),
      clearable: false,
      localization,
    };
    return resolveReactComponent(SelectReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.OBJECT &&
    schemaProperty.format === PROPERTY_FORMATS.FONT
  ) {
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      localization,
      fontFamilyOptions: getSchemaPropertyContstraints(
        schema,
        propertyKey,
        'fontFamily',
      ),
      fontStyleOptions: getSchemaPropertyContstraints(
        schema,
        propertyKey,
        'fontStyle',
      ),
      fontWeightOptions: getSchemaPropertyContstraints(
        schema,
        propertyKey,
        'fontWeight',
      ),
      fontSizeContstraints: getSchemaPropertyContstraints(
        schema,
        propertyKey,
        'fontSize',
      ),
    };
    return resolveReactComponent(FontReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.OBJECT &&
    schemaProperty.format === PROPERTY_FORMATS.ENTITY_REFERENCE_ARRAY &&
    schemaProperty.referencedSchema ===
      PROPERTY_REFERENCED_SCHEMAS.IMAGE_ATTACHMENT
  ) {
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      assetManager: options.assetManager,
      folderName: options.canonicalName,
      editorWidth: sectionProperty.width,
      editorHeight: sectionProperty.height,
      localization,
    };
    return resolveReactComponent(GalleryReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.OBJECT &&
    schemaProperty.format === PROPERTY_FORMATS.ATTACHMENT &&
    schemaProperty.referencedSchema ===
      PROPERTY_REFERENCED_SCHEMAS.IMAGE_ATTACHMENT
  ) {
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      assetManager: options.assetManager,
      folderName: options.canonicalName,
      editorWidth: sectionProperty.width,
      editorHeight: sectionProperty.height,
      localization,
    };
    return resolveReactComponent(ImageUploaderReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.OBJECT &&
    schemaProperty.format === PROPERTY_FORMATS.ATTACHMENT &&
    schemaProperty.referencedSchema ===
      PROPERTY_REFERENCED_SCHEMAS.VIDEO_ATTACHMENT
  ) {
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      thumbnailName: t(LOCALIZATION.VIDEO_THUMBNAIL, localization),
      touch: options.touch,
      assetManager: options.assetManager,
      folderName: options.canonicalName,
      localization,
    };
    return resolveReactComponent(VideoUploaderReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.OBJECT &&
    schemaProperty.format === PROPERTY_FORMATS.GEOLOCATION
  ) {
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      placeholder: t(
        LOCALIZATION.GEOLOCATION_EMPTY_PLACEHOLDER_LABEL,
        localization,
      ),
      latitudeName: `${propertyTitle} - ${t(
        LOCALIZATION.GEOLOCATION_LATITUDE_LABEL,
        localization,
      )}`,
      longitudeName: `${propertyTitle} - ${t(
        LOCALIZATION.GEOLOCATION_LONGITUDE_LABEL,
        localization,
      )}`,
      googleApiKey: options.googleApiKey,
      touch: options.touch,
      localization,
    };
    return resolveReactComponent(GeolocationReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.OBJECT &&
    schemaProperty.format === PROPERTY_FORMATS.DATE_TIME
  ) {
    // try to get timezoneId (needed to be more precise with timezones selector so server is
    // returning timezoneId as an extra to the datetime schema property)
    const timezoneField = _.get(fields, resolveTimezoneKey(propertyKey));

    const props = {
      elementId: propertyKey,
      field: propertyField,
      timezoneField,
      name: propertyTitle,
      timezoneName: t(LOCALIZATION.DATE_TIME_TIMEZONE_LABEL, localization),
      touch: options.touch,
      localization,
    };
    return resolveReactComponent(DateTimeReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.INTEGER &&
    schemaProperty.format === PROPERTY_FORMATS.INTEGER
  ) {
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      maxLength: schemaProperty.maxLength,
      localization,
    };
    return resolveReactComponent(ReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.BOOLEAN &&
    schemaProperty.format === PROPERTY_FORMATS.BOOLEAN
  ) {
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      localization,
    };
    return resolveReactComponent(BooleanReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.NUMBER &&
    schemaProperty.format === PROPERTY_FORMATS.NUMBER
  ) {
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      maxLength: schemaProperty.maxLength,
      localization,
    };
    return resolveReactComponent(ReduxFormElement, props);
  }

  if (
    schemaProperty.type === PROPERTY_TYPES.OBJECT &&
    schemaProperty.format === PROPERTY_FORMATS.ENTITY_REFERENCE
  ) {
    const props = {
      elementId: propertyKey,
      field: propertyField,
      name: propertyTitle,
      canonicalName: schemaProperty.referencedSchema,
      loadSchema: options.loadSchema,
      loadResources: options.loadResources,
      placeholder: t(
        LOCALIZATION.ENTITY_REFERENCE_PLACEHOLDER_LABEL,
        localization,
      ),
      touch: options.touch,
      localization,
    };
    return resolveReactComponent(EntityReferenceReduxFormElement, props);
  }

  return null;
}

export function resolveSectionProperty(
  sectionProperty,
  schema,
  fields,
  options,
) {
  const editorSize = getEditorSize(schema);

  const sectionPropertyChildren = resolveFormElement(
    sectionProperty,
    schema,
    fields,
    options,
  );

  if (!sectionPropertyChildren) {
    return null;
  }

  const sectionPropertyColSize = _.get(sectionProperty, 'size', editorSize);
  const sectionPropertyProps = {
    children: sectionPropertyChildren,
    colSize: sectionPropertyColSize,
  };

  return resolveReactComponent(FormContainer, sectionPropertyProps);
}

export function resolveSchemaElements(schema, fields, options) {
  const localization = _.get(options, 'localization');
  const editorSize = getEditorSize(schema);
  const sections = getEditorSections(schema);

  return _.map(sections, section => {
    const sectionChildren = _.compact(
      _.map(section.properties, sectionProperty =>
        resolveSectionProperty(sectionProperty, schema, fields, options),
      ),
    );
    const sectionProps = {
      title: t(section.title, localization),
      editorSize,
      children: sectionChildren,
    };

    return resolveReactComponent(SectionForm, sectionProps);
  });
}

function calculateChanges(newObject, object) {
  return _.transform(newObject, (result, newValue, key) => {
    const value = object[key];

    if (_.isEqual(newValue, value)) {
      return;
    }

    if (_.isObject(newValue) && _.isObject(value)) {
      // eslint-disable-next-line no-param-reassign
      result[key] = calculateChanges(newValue, value);
    }

    // eslint-disable-next-line no-param-reassign
    result[key] = newValue;
  });
}

export function calculateDifferenceObject(newObject, object) {
  if (!object) {
    return newObject;
  }

  return calculateChanges(newObject, object);
}

export function resolveIsArrayPropertiesChanged(schema, newObject, object) {
  const propertyKeys = getSchemaPropertyKeys(schema);

  return _.some(propertyKeys, propertyKey => {
    const schemaProperty = getSchemaProperty(schema, propertyKey);
    if (schemaProperty.type !== PROPERTY_TYPES.ARRAY) {
      return false;
    }

    const newValue = _.compact(_.get(newObject, propertyKey));
    const value = _.compact(_.get(object, propertyKey));

    // redux form v5 has problem with calculating is form dirty when item
    // from the array property is removed (adding a new item and updating item
    // is working properly). redux form v6 has this fixed.
    if (newValue.length !== value.length) {
      return true;
    }

    return false;
  });
}
