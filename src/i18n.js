import _ from 'lodash';
import { en } from './translations';

export default function translate(key, localization) {
  const translation = _.get(localization, key);
  if (translation) {
    return translation;
  }

  const localTranslation = _.get(en, key);
  if (localTranslation) {
    return localTranslation;
  }

  return key;
}
