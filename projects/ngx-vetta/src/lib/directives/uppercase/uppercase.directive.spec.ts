import { Component, ElementRef } from '@angular/core';
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
import { UpperCaseDirective } from './uppercase.directive';

@Component({
  template: `
    <p style="display: none;" data-testid="selection">Lorem ipsun</p>
    <form [formGroup]="form">
      <input type="text" formControlName="test" vetUppercase data-testid="input" />
    </form>
  `
})
class HostComponent {
  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      test: new FormControl('', [Validators.required])
    });
  }
}

class MockElementRef extends ElementRef {}

describe('UpperCaseDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;
  let input: HTMLInputElement;
  const mockElementRef: MockElementRef = new MockElementRef(null);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpperCaseDirective, HostComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
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

  it('should convert to uppercase', async () => {
    TestUtils.setFieldElementValue(input, 'abc');
    TestUtils.keydown(fixture, 'input');
    await new Promise(resolve => setTimeout(resolve, 50)); // delay para que o evento seja disparado
    fixture.detectChanges();
    expect(input.value).toBe('ABC');
  });
});
