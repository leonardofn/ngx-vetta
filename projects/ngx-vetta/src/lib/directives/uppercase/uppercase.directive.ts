import { Directive, ElementRef, HostListener } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
  selector: 'input[vetUppercase], textarea[vetUppercase]'
})
export class UpperCaseDirective {
  constructor(private elRef: ElementRef, private ngControl: NgControl) {}

  /* Trata as teclas */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (/[a-zÀ-ú]/.test(key)) {
      setTimeout(() => {
        const value = this.inputElement.value.toUpperCase();
        this.control.setValue(value);
        event.preventDefault();
      });
    }
  }

  private get control(): AbstractControl {
    return this.ngControl.control;
  }

  private get inputElement(): HTMLInputElement | HTMLTextAreaElement {
    return this.elRef.nativeElement;
  }
}
