import { TestBed } from '@angular/core/testing';

import { PivInterceptorService } from './piv-interceptor.service';

describe('PivInterceptorService', () => {
  let service: PivInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PivInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
