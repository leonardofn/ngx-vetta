import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { DecimalSeparator } from '../../core/types/decimal-separator.type';

@Directive({
  selector: 'input[type=text][vetNumberMask]',
})
export class DecimalNumberMaskDirective implements OnChanges {
  // ^([1-9]\\d*|0)?(\\,\\d{0,2})?$ -> inteiros ilimitados
  // ^([1-9]\\d{0,2}|0)?(\\,\\d{0,2})?$ -> inteiros limitados
  private decimalNumberStr = '^([1-9]\\d*|0)?(\\,\\d{0,2})?$';
  private decimalNumberRegex = new RegExp(this.decimalNumberStr);
  private onlyNumberRegex = /^\d+$/;
  private decimals = '00';
  private oldValue = '';

  constructor(private elRef: ElementRef, private ngControl: NgControl) {}

  @Input('maxIntegers') maxIntegers: number = 0;
  @Input('allowNegative') allowNegative: boolean = false;
  @Input('decimalSeparator') decimalSeparator: DecimalSeparator = ',';

  @Input()
  set vetNumberMask(value: string) {
    this.handleDecimalInput(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleInputs(changes);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    this.setControlValue();
  }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    this.handleInputValue();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    this.handleInputValue();
  }

  private handleInputs(changes: SimpleChanges) {
    const { allowNegative, maxIntegers, decimalNumberMask } = changes;
    const { currentValue: maxDecimal = null } = decimalNumberMask || {};
    const { currentValue: maxInt = 0 } = maxIntegers || {};
    const { currentValue: allowNeg = false } = allowNegative || {};
    const allowNegativeRegex = allowNeg === true ? '^[-]?' : '^';
    this.decimalNumberStr = `${allowNegativeRegex}([1-9]\\d*|0)?(\\${this.decimalSeparator}\\d{0,2})?$`;
    this.handleDecimalInput(maxDecimal);
    this.handleIntegerInput(maxInt);
  }

  private handleIntegerInput(maxInt: number) {
    maxInt = typeof maxInt === 'number' ? maxInt : this.maxIntegers;
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

  private handleDecimalInput(value: string) {
    value = value || this.decimals.length.toString();
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
      this.decimals = '000000000'.substring(0, +value);
    }
    this.decimalNumberRegex = new RegExp(this.decimalNumberStr);
  }

  private setControlValue() {
    if (this.decimals === '') return;
    const value = this.elRef.nativeElement.value || '';
    const valueMask = this.getControlValue(value);
    this.control.setValue(valueMask, { emit: false });
  }

  private handleInputValue() {
    const value = this.elRef.nativeElement.value || '';
    if (!this.decimalNumberRegex.test(value)) {
      this.control.setValue(this.oldValue, { emit: false });
    } else {
      this.oldValue = value;
    }
  }

  private getControlValue = (value: string): string => {
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
}
