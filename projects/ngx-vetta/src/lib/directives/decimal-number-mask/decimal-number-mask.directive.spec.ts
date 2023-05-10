import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import TestUtils from '../../shared/utils/test.utils';
import { DecimalNumberMaskDirective } from './decimal-number-mask.directive';

@Component({
  template: `
    <p data-testid="selection">1,123</p>
    <form [formGroup]="form">
      <input
        type="text"
        formControlName="test"
        vetNumberMask
        [allowNegative]="true"
        data-testid="input"
      />
    </form>
  `,
})
class HostComponent {
  @ViewChild(DecimalNumberMaskDirective)
  decimalNumberMaskDirective: DecimalNumberMaskDirective;
  form: FormGroup;
  constructor() {}
  ngOnInit(): void {
    this.form = new FormGroup({
      test: new FormControl('', [Validators.required]),
    });
  }
}

class MockElementRef extends ElementRef {}

describe('DecimalNumberMaskDirective', async () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;
  let input: HTMLInputElement;
  let mockElementRef: MockElementRef = new MockElementRef(null);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DecimalNumberMaskDirective, HostComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: ElementRef, useValue: mockElementRef },
        { provide: NgControl, useValue: NgControl },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    input = TestUtils.findEl(fixture, 'input').nativeElement;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should allow only numbers', () => {
    TestUtils.setFieldElementValue(input, 'a');
    TestUtils.blur(fixture, 'input');
    fixture.detectChanges();
    expect(input.value).toBe('');
  });

  it('should allow negative numbers', () => {
    TestUtils.setFieldElementValue(input, '-1');
    TestUtils.blur(fixture, 'input');
    fixture.detectChanges();
    expect(input.value).toBe('-1,00');
  });

  it('should not allow negative numbers', () => {
    component.decimalNumberMaskDirective.allowNegative = false;
    TestUtils.setFieldElementValue(input, '-');
    TestUtils.blur(fixture, 'input');
    fixture.detectChanges();
    expect(input.value).toBe('0,00');
  });
});
