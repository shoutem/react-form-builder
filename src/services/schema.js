import _ from 'lodash';

export function getSchemaProperties(schema) {
  return _.get(schema, 'properties');
}

export function getSchemaProperty(schema, key) {
  return _.get(schema, `properties.${key}`);
}

export function getReferencedSchema(schema, key) {
  return _.get(schema, `properties.${key}.referencedSchema`);
}

export function getReferencedSchemas(schema) {
  const properties = getSchemaProperties(schema);
  const schemas = [];

  const values = _.values(properties);
  _.forEach(values, value => {
    const schema = _.get(value, 'referencedSchema');

    if (schema) {
      schemas.push(schema);
    }
  });

  return schemas;
}

export function getIncludeProperties(schema) {
  const properties = getSchemaProperties(schema);
  const include = [];

  _.forOwn(properties, (value, key) => {
    if (_.has(value, 'referencedSchema')) {
      include.push(key);
    }
  });

  return include;
}

export function getLayoutsTable(schema) {
  return _.get(schema, 'layouts.table');
}

export function getEditorSize(schema) {
  return _.get(schema, 'editor.size', 12);
}

export function getEditorSections(schema) {
  const sections =
    _.get(schema, 'editor.sections') || _.get(schema, 'layout.sections');

  if (!_.isEmpty(sections)) {
    return sections;
  }

  // support for legacy schemas
  const schemaProperties = getSchemaProperties(schema);
  const mappedProperties = _.map(schemaProperties, (value, index) => ({
    name: index,
    displayPriority: _.get(value, 'displayPriority'),
  }));

  const sortedProperties = _.sortBy(mappedProperties, ['displayPriority']);
  const properties = _.map(sortedProperties, 'name');
  const legacySections = [{ properties }];

  return legacySections;
}

export function getSectionPropertyKey(sectionProperty) {
  if (_.isString(sectionProperty)) {
    return sectionProperty;
  }

  return _.get(sectionProperty, 'name');
}

export function getSchemaPropertyKeys(schema) {
  return _.keys(_.get(schema, 'properties'));
}

export function getSchemaPropertyEnum(schema, propertyKey, valueKey) {
  const schemaProperty = getSchemaProperty(schema, propertyKey);
  const options = _.get(schemaProperty, ['constraints', valueKey, 'enum']);

  if (options) {
    return options;
  }

  const format = _.get(schemaProperty, 'format');
  const globalOptions = _.get(schema, [
    'formats',
    format,
    'constraints',
    valueKey,
    'enum',
  ]);

  return globalOptions;
}

export function getSchemaPropertyConstraints(schema, propertyKey, valueKey) {
  const schemaProperty = getSchemaProperty(schema, propertyKey);
  const constraints = _.get(schemaProperty, ['constraints', valueKey]);

  if (constraints) {
    return constraints;
  }

  const format = _.get(schemaProperty, 'format');
  const globalConstraints = _.get(schema, [
    'formats',
    format,
    'constraints',
    valueKey,
  ]);

  return globalConstraints;
}
