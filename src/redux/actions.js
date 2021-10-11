import { reset } from 'redux-form';

export function resetForm(formKey) {
  return reset(formKey);
}
