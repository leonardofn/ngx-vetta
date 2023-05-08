import { AbstractControl, ValidatorFn } from '@angular/forms';

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
  static get noWhiteSpace(): ValidatorFn {
    return (control: AbstractControl) => {
      return (control.value || '').trim().length ? null : { whitespace: true };
    };
  }
}
