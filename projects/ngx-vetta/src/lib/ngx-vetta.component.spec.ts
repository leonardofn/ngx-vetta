import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxVettaComponent } from './ngx-vetta.component';

describe('NgxVettaComponent', () => {
  let component: NgxVettaComponent;
  let fixture: ComponentFixture<NgxVettaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxVettaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxVettaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
