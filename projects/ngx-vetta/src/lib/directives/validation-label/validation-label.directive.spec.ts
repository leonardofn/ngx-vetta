import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import TestUtils from '../../shared/utils/test.utils';
import { VetValidationLabelDirective } from './validation-label.directive';

@Component({
  template: `
    <form [formGroup]="form">
      <input type="text" formControlName="test" vetValidationLabel data-testid="input" />
    </form>
  `
})
class HostComponent {
  form: FormGroup;
  constructor() {}
  ngOnInit(): void {
    this.form = new FormGroup({
      test: new FormControl('', [Validators.required])
    });
  }
}

class MockElementRef extends ElementRef {}

describe('VetValidationLabelDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;
  let input: HTMLInputElement;
  let mockNgControl: jasmine.SpyObj<NgControl>;
  const mockElementRef: MockElementRef = new MockElementRef(null);

  beforeEach(async () => {
    mockNgControl = jasmine.createSpyObj<NgControl>('NgControl', [
      'statusChanges',
      'errors',
      'touched'
    ]);

    await TestBed.configureTestingModule({
      declarations: [VetValidationLabelDirective, HostComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        Renderer2,
        { provide: ElementRef, useValue: mockElementRef },
        { provide: NgControl, useValue: NgControl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    input = TestUtils.findEl(fixture, 'input').nativeElement;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when input is touched and invalid', () => {
    TestUtils.setFieldElementValue(input, '');

    TestUtils.blur(fixture, 'input');
    fixture.detectChanges();
    expect(input.classList).toContain('is-invalid');

    const elements = TestUtils.queryAllByCss(
      fixture,
      '.invalid-feedback'
    ).map<HTMLDivElement>(el => el.nativeElement);
    expect(elements.length).toBe(1);
  });

  it('should remove error when input is valid', () => {
    TestUtils.setFieldElementValue(input, 'test');

    TestUtils.blur(fixture, 'input');
    fixture.detectChanges();
    expect(input.classList).not.toContain('is-invalid');

    const elements = TestUtils.queryAllByCss(
      fixture,
      '.invalid-feedback'
    ).map<HTMLDivElement>(el => el.nativeElement);
    expect(elements.length).toBe(0);
  });
});
