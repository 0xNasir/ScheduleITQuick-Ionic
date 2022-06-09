import { TestBed } from '@angular/core/testing';

import { PivService } from './piv.service';

describe('PivService', () => {
  let service: PivService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PivService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
