import { Component, ElementRef } from '@angular/core';
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
import { VetOnlyNumberDirective } from './only-number.directive';

@Component({
  template: `
    <form [formGroup]="form">
      <input
        type="text"
        formControlName="test"
        vetOnlyNumber
        [allowNegative]="true"
        data-testid="input"
      />
    </form>
  `,
})
class HostComponent {
  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      test: new FormControl('', [Validators.required]),
    });
  }
}

class MockElementRef extends ElementRef {}

describe('VetOnlyNumberDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;
  let input: HTMLInputElement;
  let mockElementRef: MockElementRef = new MockElementRef(null);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VetOnlyNumberDirective, HostComponent],
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
});
