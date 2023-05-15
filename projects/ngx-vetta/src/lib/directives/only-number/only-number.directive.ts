import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
  selector: 'input[vetOnlyNumber]',
})
export class OnlyNumberDirective {
  private readonly regexNumber = /^\d*$/;
  private readonly regexNegativeNumber = /^[-]?\d*$/;
  private oldValue = '';

  @Input() allowNegative: boolean = false;

  constructor(private elRef: ElementRef, private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onChange() {
    this.handleChangeValue();
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    if (this.inputElement.value === '-') {
      this.inputElement.value = '';
      this.setRealValue();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipValue = event.clipboardData.getData('text/plain');
    this.handleClipboardValue(clipValue);
  }

  private handleClipboardValue(clipValue: string) {
    setTimeout(() => {
      if (!this.regex.test(clipValue)) {
        this.setRealValue();
      }
    });
  }

  private handleChangeValue() {
    const value = this.inputElement.value || '';
    if (!this.regex.test(value)) {
      this.inputElement.value = this.oldValue;
    } else {
      this.inputElement.value = value;
      this.oldValue = value;
    }
    this.setRealValue();
  }

  private setRealValue() {
    this.control.setValue(this.realValue, {
      // emitModelToViewChange: quando verdadeiro ou não fornecido (o padrão),
      // cada alteração aciona um evento onChange para atualizar a exibição.
      emitModelToViewChange: false,
    });
  }

  private get control(): AbstractControl {
    return this.ngControl.control;
  }

  private get regex(): RegExp {
    return this.allowNegative ? this.regexNegativeNumber : this.regexNumber;
  }

  private get inputElement(): HTMLInputElement {
    return this.elRef.nativeElement as HTMLInputElement;
  }

  private get realValue(): number | '' {
    const value = this.oldValue.replace(/\,/, '.');
    return !value || isNaN(+value) ? '' : +value;
  }
}
