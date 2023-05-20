import { ValidationErrors, ValidatorFn } from '@angular/forms';

export default class ValidatorsUtils {
  /**
   * Validation utilities for working with reactive form fields
   */

  /**
   * @description
   * Validator that requires that the control is not an empty string.
   *
   * @returns An error map with the `required` property
   * if the validation check fails, otherwise `null`.
   *
   */
  static noWhiteSpace(): ValidatorFn {
    const validatorFn: ValidatorFn = (control): ValidationErrors | null => {
      return (control.value || '').trim().length ? null : { whitespace: true };
    };
    return validatorFn;
  }
}
