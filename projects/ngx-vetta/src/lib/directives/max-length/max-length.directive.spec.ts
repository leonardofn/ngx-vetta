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
import { VetMaxLengthDirective } from './max-length.directive';

@Component({
  template: `
    <p style="display: none;" data-testid="selection">Lorem ipsun</p>
    <form [formGroup]="form">
      <input
        type="text"
        formControlName="test"
        vetMaxLength="5"
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

describe('VetMaxLengthDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;
  let input: HTMLInputElement;
  let mockElementRef: MockElementRef = new MockElementRef(null);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VetMaxLengthDirective, HostComponent],
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
