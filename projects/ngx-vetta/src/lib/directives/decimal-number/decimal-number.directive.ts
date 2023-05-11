import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { DecimalNumberOptions } from '../../core/models/decimal-number.model';
import { DecimalSeparator } from '../../core/types/decimal-separator.type';

@Directive({
  selector: 'input[type=text][vetDecimalNumber]',
})
export class DecimalNumberDirective {
  // ^([1-9]\\d*|0)?(\\,\\d{0,2})?$ -> inteiros ilimitados
  // ^([1-9]\\d{0,2}|0)?(\\,\\d{0,2})?$ -> inteiros limitados
  private decimalNumberStr = '^([1-9]\\d*|0)?(\\,\\d{0,2})?$';
  private decimalNumberRegex = new RegExp(this.decimalNumberStr);
  private onlyNumberRegex = /^\d+$/;

  private decimals = '00';
  private decimalSeparator: DecimalSeparator = ',';
  private oldValue = '';
  private enableMask: boolean;

  constructor(private elRef: ElementRef, private ngControl: NgControl) {}

  @Input('decimalNumberOptions')
  set decimalNumberOptions(options: DecimalNumberOptions) {
    let {
      maxIntegers = 0,
      maxDecimals = 2,
      decimalSeparator = ',',
      allowNegative = false,
      enableMask = false,
    } = options || {};

    maxDecimals = maxDecimals > 0 ? maxDecimals : 2;
    maxIntegers = maxIntegers > 0 ? maxIntegers : 0;
    this.decimalSeparator = decimalSeparator;
    const regexStart = allowNegative ? '^[-]?' : '^';
    this.decimalNumberStr = `${regexStart}([1-9]\\d*|0)?(\\${this.decimalSeparator}\\d{0,${maxDecimals}})?$`;
    this.enableMask = enableMask;
    this.handleDecimalPart(maxDecimals.toString());
    this.handleIntegerPart(maxIntegers);
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    this.setControlValue();
  }

  @HostListener('input', ['$event'])
  onInput() {
    this.handleInputValue();
  }

  @HostListener('paste', ['$event'])
  onPaste() {
    this.handleInputValue();
  }

  private handleIntegerPart(maxInt: number) {
    const integerIndex = this.decimalNumberStr.indexOf('d*|');
    const valueValid =
      integerIndex > 0 && this.onlyNumberRegex.test(String(maxInt));
    if (maxInt > 0 && valueValid) {
      this.decimalNumberStr = this.decimalNumberStr.replace(
        'd*|',
        `d{0,${maxInt - 1}}|`
      );
    }
    this.decimalNumberRegex = new RegExp(this.decimalNumberStr);
  }

  private handleDecimalPart(value: string) {
    const decimalIndex = this.decimalNumberStr.indexOf('d{0,');
    const valueValid = decimalIndex > 0 && this.onlyNumberRegex.test(value);
    if (valueValid) {
      const decimals = this.decimalNumberStr.substring(
        decimalIndex + 4,
        decimalIndex + 5
      );
      this.decimalNumberStr = this.decimalNumberStr.replace(
        'd{0,' + decimals,
        'd{0,' + value
      );
      this.decimals = '0000000000'.substring(0, +value);
    }
    this.decimalNumberRegex = new RegExp(this.decimalNumberStr);
  }

  private setControlValue() {
    if (this.decimals === '') return;
    const valueInput = this.inputElement.value || '';
    const value = this.enableMask
      ? this.getMaskedValue(valueInput)
      : valueInput;
    this.oldValue = value;
    this.control.setValue(value, { emit: false });
  }

  private handleInputValue() {
    const value = this.inputElement.value || '';
    if (!this.decimalNumberRegex.test(value)) {
      this.control.setValue(this.oldValue, { emit: false });
    } else {
      this.oldValue = value;
    }
  }

  private getMaskedValue = (value: string): string => {
    const values = value.trim().split(this.decimalSeparator);
    if (values.length > 1) {
      const integer =
        values[0] === ''
          ? `0${this.decimalSeparator}`
          : values[0] + this.decimalSeparator;

      const decimal = (values[1] + this.decimals).substring(
        0,
        this.decimals.length
      );
      return integer + decimal;
    }

    return values[0] !== ''
      ? (values[0] === '-' ? '0' : values[0]) +
          this.decimalSeparator +
          this.decimals
      : '';
  };

  private get control(): AbstractControl {
    return this.ngControl.control;
  }

  private get inputElement(): HTMLInputElement {
    return this.elRef.nativeElement as HTMLInputElement;
  }
}
