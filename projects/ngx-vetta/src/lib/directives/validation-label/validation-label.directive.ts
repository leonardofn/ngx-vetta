import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Bootstap CSS classes

enum CssClass {
  REQUIRED = 'required',
  IS_INVALID = 'is-invalid',
  INVALID_FEEDBACK = 'invalid-feedback',
}

@Directive({ selector: '[validationLabel]' })
export class ValidationLabelDirective implements OnInit, OnDestroy {
  @Input('formControlName') formControlName: string;
  private unsub$ = new Subject<void>();
  private divElement: HTMLDivElement | null = null;
  private labelElementId = '';

  constructor(
    private renderer2: Renderer2,
    private elRef: ElementRef<HTMLElement>,
    private control: NgControl
  ) {}

  ngOnInit(): void {
    this.labelElementId = Boolean(this.formControlName)
      ? this.formControlName + '-error'
      : 'control-' + this.generateID();
    this.control.statusChanges
      .pipe(takeUntil(this.unsub$))
      .subscribe((status) => {
        if (status === 'INVALID' && this.control.touched) {
          this.showError();
        } else {
          this.removeError();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
    this.removeError();
  }

  @HostListener('blur', ['$event']) onBlurEvent() {
    // Isto é necessário para lidar com o caso de clicar num campo necessário e sair.
    // Os restantes são tratados por assinatura de mudança de estado se (this.control.value === null || this.control.value === '') { }
    if (this.control.errors) {
      this.showError();
    } else {
      this.removeError();
    }
  }

  private showError() {
    this.removeError();
    const errorMsg = this.getMessageValidation();
    this.divElement = this.createDivElement(errorMsg);
    this.renderer2.appendChild(
      this.elRef.nativeElement.parentElement,
      this.divElement
    );
    this.renderer2.addClass(this.elRef.nativeElement, CssClass.REQUIRED);
    this.renderer2.addClass(this.elRef.nativeElement, CssClass.IS_INVALID);
  }

  private removeError() {
    if (this.divElement) {
      this.renderer2.removeClass(this.elRef.nativeElement, CssClass.REQUIRED);
      this.renderer2.removeClass(
        this.elRef.nativeElement,
        CssClass.IS_INVALID
      );
      this.renderer2.removeChild(
        this.elRef.nativeElement.parentElement,
        this.divElement
      );
      this.divElement = null;
    }
  }

  private createDivElement = (errorMsg: string): HTMLDivElement => {
    const divLabel = this.renderer2.createText(errorMsg);
    const div = this.renderer2.createElement('div') as HTMLDivElement;
    this.renderer2.setAttribute(div, 'id', this.labelElementId);
    this.renderer2.addClass(div, CssClass.INVALID_FEEDBACK);
    this.renderer2.appendChild(div, divLabel);
    return div;
  };

  private getMessageValidation = (): string => {
    const messages = {
      required: (e: ValidationErrors) => 'Campo obrigatório.',
      invalid: (e: ValidationErrors) => 'Campo inválido.',
      minlength: (e: ValidationErrors) =>
        `Deve ter no mínimo ${e.requiredLength} caracteres.`,
      maxlength: (e: ValidationErrors) =>
        `Deve ter no máximo ${e.requiredLength} caracteres.`,
    };
    const valErrors: ValidationErrors = this.control.errors;
    const firstErrorKey = Object.keys(valErrors)[0];
    return messages[firstErrorKey](valErrors[firstErrorKey]);
  };

  private generateID = (): string =>
    Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString(
      16
    );
}
