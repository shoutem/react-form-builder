import _ from 'lodash';

export function resolveFormState(reducerKey) {
  return state => _.get(state, reducerKey, {});
}
