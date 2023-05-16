import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { DecimalNumberOptions } from '../../core/models/decimal-number.model';
import { DecimalSeparator } from '../../core/types/decimal-separator.type';

@Directive({
  selector: 'input[type=text][vetDecimalNumber]'
})
export class VetDecimalNumberDirective {
  // ^([1-9]\\d*|0)?(\\,\\d{0,2})?$ -> inteiros ilimitados
  // ^([1-9]\\d{0,2}|0)?(\\,\\d{0,2})?$ -> inteiros limitados
  private decimalNumberStr = '^([1-9]\\d*|0)?(\\,\\d{0,2})?$';
  private decimalNumberRegex = new RegExp(this.decimalNumberStr);
  private onlyNumberRegex = /^\d+$/;

  private allowNegative: boolean;
  private enableMask: boolean;
  private decimalSeparator: DecimalSeparator = ',';
  private decimals = '00';
  private oldValue = '';

  constructor(private elRef: ElementRef, private ngControl: NgControl) {}

  @Input('decimalNumberOptions')
  set decimalNumberOptions(options: DecimalNumberOptions) {
    let {
      maxIntegers = 0,
      maxDecimals = 2,
      decimalSeparator = ',',
      allowNegative = false,
      enableMask = false
    } = options || {};

    maxDecimals = maxDecimals > 0 ? maxDecimals : 2;
    maxIntegers = maxIntegers > 0 ? maxIntegers : 0;
    this.decimalSeparator = decimalSeparator;
    this.enableMask = enableMask;
    this.allowNegative = allowNegative;
    const regexStart = allowNegative ? '^[-]?' : '^';
    this.decimalNumberStr = `${regexStart}([1-9]\\d*|0)?(\\${this.decimalSeparator}\\d{0,${maxDecimals}})?$`;

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
    const valueValid = integerIndex > 0 && this.onlyNumberRegex.test(String(maxInt));
    if (maxInt > 0 && valueValid) {
      this.decimalNumberStr = this.decimalNumberStr.replace('d*|', `d{0,${maxInt - 1}}|`);
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
    const originalValue = this.inputElement.value || '';
    const displayValue = this.enableMask
      ? this.getMaskedValue(originalValue)
      : this.allowNegative && originalValue === '-'
      ? ''
      : originalValue;
    this.inputElement.value = displayValue;
    this.oldValue = displayValue;
    this.setRealValue();
  }

  private handleInputValue() {
    const value = this.inputElement.value || '';
    if (!this.decimalNumberRegex.test(value)) {
      this.inputElement.value = this.oldValue;
    } else {
      this.inputElement.value = value;
      this.oldValue = value;
    }
    this.setRealValue();
  }

  private getMaskedValue = (value: string): string => {
    const valueSplitted = value.trim().split(this.decimalSeparator);
    let [integer, decimal] = valueSplitted;

    if (valueSplitted.length > 1) {
      integer = ['', '-'].includes(integer) ? integer + '0' : integer;
      decimal = (decimal + this.decimals).substring(0, this.decimals.length);
      return integer + this.decimalSeparator + decimal;
    }

    return this.onlyNumberRegex.test(integer)
      ? integer + this.decimalSeparator + this.decimals
      : '';
  };

  private setRealValue() {
    this.control.setValue(this.realValue, {
      // emitModelToViewChange: quando verdadeiro ou não fornecido (o padrão),
      // cada alteração aciona um evento onChange para atualizar a exibição.
      emitModelToViewChange: false
    });
  }

  private get control(): AbstractControl {
    return this.ngControl.control;
  }

  private get inputElement(): HTMLInputElement {
    return this.elRef.nativeElement as HTMLInputElement;
  }

  private get realValue(): number | '' {
    const value = this.oldValue.replace(/\,/, '.');
    return !value || isNaN(+value) ? '' : +value;
  }
}
