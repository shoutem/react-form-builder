import _ from 'lodash';
import { en } from './translations';

function transformVariables(title, variables) {
  if (!title) {
    return title;
  }

  let transformedTitle = title;
  _.forEach(variables, (value, key) => {
    const re = new RegExp(_.escapeRegExp(`{{${key}}}`), 'g');
    transformedTitle = transformedTitle.replace(re, value);
  });

  return transformedTitle;
}

export default function translate(key, localization, variables) {
  const translation = _.get(localization, key);
  if (translation) {
    return transformVariables(translation, variables);
  }

  const localTranslation = _.get(en, key);
  if (localTranslation) {
    return transformVariables(localTranslation, variables);
  }

  return key;
}
