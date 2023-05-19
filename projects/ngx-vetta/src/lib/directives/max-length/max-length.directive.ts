import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[vetMaxLength], textarea[vetMaxLength]'
})
export class VetMaxLengthDirective {
  private readonly onlyNumberRegex = /^\d+$/;

  @Input() vetMaxLength: number | string = '';

  constructor(private elRef: ElementRef, private ngControl: NgControl) {}

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const value = this.inputElement.value || '';
    const key = event.key.toUpperCase();
    const maxLength = this.maxLength;

    if (this.isPaste(key, event)) return;

    if (window.getSelection().toString().length > 0) return;

    if (!this.onlyNumberRegex.test(maxLength) || this.isKeysAllowed(key, event)) {
      return;
    }

    if (value.length > +maxLength - 1) event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipValue = event.clipboardData.getData('text/plain') || '';
    const maxLength = this.maxLength;

    if (!this.onlyNumberRegex.test(maxLength)) return;

    if (clipValue.length > +maxLength - 1) {
      setTimeout(() => {
        this.ngControl.control.setValue(clipValue.substring(0, +maxLength));
      });
    }
  }

  private isKeysAllowed(key: string, event: KeyboardEvent): boolean {
    return (
      // Teclas comuns: backspace, tab, enter, escape, delete, home, end, left, right
      // Teclas de modificação combinadas: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      this.isCommonKey(key) || this.isModifierKeyCombination(key, event)
    );
  }

  private isCommonKey = (key: string): boolean => {
    return [
      'BACKSPACE',
      'TAB',
      'ENTER',
      'ESCAPE',
      'DELETE',
      'HOME',
      'END',
      'ARROWLEFT',
      'ARROWRIGHT'
    ].includes(key);
  };

  private isModifierKeyCombination = (key: string, event: KeyboardEvent): boolean => {
    const { ctrlKey, metaKey } = event;
    return ['A', 'C', 'B', 'X'].includes(key) && (ctrlKey || metaKey);
  };

  private isPaste(key: string, event: KeyboardEvent) {
    const { ctrlKey, metaKey } = event;
    return key === 'V' && (ctrlKey || metaKey);
  }

  private get maxLength(): string {
    return this.vetMaxLength ? this.vetMaxLength.toString().trim() : '';
  }

  private get inputElement(): HTMLInputElement | HTMLTextAreaElement {
    return this.elRef.nativeElement;
  }
}
