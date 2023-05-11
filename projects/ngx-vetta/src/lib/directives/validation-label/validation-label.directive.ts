import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, NgControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CssClass } from '../../core/enums/css-class.enum';
import ValidatorsUtils from '../../shared/utils/validators.utils';

@Directive({
  selector:
    'input[type=text][vetValidationLabel], textarea[vetValidationLabel]',
})
export class ValidationLabelDirective implements OnInit, OnChanges, OnDestroy {
  private unsub$: Subject<void> = new Subject<void>();
  private divElement: HTMLDivElement | null = null;

  @Input('formControlName') formControlName: string = '';
  @Input('noWhiteSpace') noWhiteSpace: boolean = true;

  constructor(
    private renderer2: Renderer2,
    private elRef: ElementRef,
    private ngControl: NgControl
  ) {}

  ngOnInit(): void {
    this.onStatusChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { currentValue } = changes.noWhiteSpace || {};
    this.handleWhiteSpaceValidator(currentValue);
  }

  ngOnDestroy(): void {
    this.divElement = null;
    this.removeError();
    this.unsub$.next();
    this.unsub$.complete();
  }

  @HostListener('blur', ['$event']) onBlurEvent() {
    // Isto é necessário para lidar com o caso de clicar num campo necessário e sair.
    // Os restantes são tratados por assinatura de mudança de estado se (this.control.value === null || this.control.value === '') { }
    if (this.ngControl.errors) {
      this.showError();
    } else {
      this.removeError();
    }
  }

  private onStatusChanges() {
    this.ngControl.statusChanges
      .pipe(takeUntil(this.unsub$))
      .subscribe((status) => {
        if (status === 'INVALID' && this.ngControl.touched) {
          this.showError();
        } else {
          this.removeError();
        }
      });
  }

  private handleWhiteSpaceValidator(noWhiteSpace: any) {
    if (noWhiteSpace && typeof noWhiteSpace === 'boolean') {
      this.control.setValidators([
        this.control.validator,
        ValidatorsUtils.noWhiteSpace,
      ]);
    } else {
      const defaultErrors = this.control.validator;
      this.control.clearValidators();
      this.control.setValidators(defaultErrors);
    }
    this.control.updateValueAndValidity();
  }

  private showError() {
    this.removeError();
    const errorMsg = this.getMessageValidation();
    this.divElement = this.createDivElement(errorMsg);
    this.inputElement.after(this.divElement);
    this.renderer2.addClass(this.inputElement, CssClass.REQUIRED);
    this.renderer2.addClass(this.inputElement, CssClass.IS_INVALID);
  }

  private removeError() {
    if (this.isDivElement) {
      this.renderer2.removeClass(this.inputElement, CssClass.REQUIRED);
      this.renderer2.removeClass(this.inputElement, CssClass.IS_INVALID);
      this.renderer2.removeChild(
        this.inputElement.parentElement,
        this.divElement
      );
      this.divElement = null;
    }
  }

  private createDivElement = (errorMsg: string): HTMLDivElement => {
    const divLabel = this.renderer2.createText(errorMsg);
    const div = this.renderer2.createElement('div') as HTMLDivElement;
    this.renderer2.setAttribute(div, 'id', this.elementId);
    this.renderer2.addClass(div, CssClass.INVALID_FEEDBACK);
    this.renderer2.appendChild(div, divLabel);
    return div;
  };

  private getMessageValidation = (): string => {
    const messages: { [key: string]: (e: ValidationErrors) => string } = {
      required: () => 'Campo obrigatório.',
      invalid: () => 'Campo inválido.',
      whitespace: () => 'Campo inválido.',
      minlength: (e) => `Deve ter no mínimo ${e.requiredLength} caracteres.`,
      maxlength: (e) => `Deve ter no máximo ${e.requiredLength} caracteres.`,
    };
    const valErrors: ValidationErrors = this.ngControl.errors;
    const firstErrorKey = Object.keys(valErrors)[0];
    return messages[firstErrorKey](valErrors[firstErrorKey]);
  };

  private get control(): AbstractControl {
    return this.ngControl.control;
  }

  private get inputElement(): HTMLInputElement {
    return this.elRef.nativeElement as HTMLInputElement;
  }

  private get elementId(): string {
    const idStr = Boolean(this.formControlName)
      ? this.formControlName
      : this.ngControl.name.toString();
    return idStr.toString() + 'Invalid';
  }

  private get isDivElement(): boolean {
    return (
      typeof this.divElement === 'object' &&
      this.divElement instanceof HTMLDivElement
    );
  }
}
