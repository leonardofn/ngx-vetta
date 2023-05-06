import { TestBed } from '@angular/core/testing';

import { NgxVettaService } from './ngx-vetta.service';

describe('NgxVettaService', () => {
  let service: NgxVettaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxVettaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
