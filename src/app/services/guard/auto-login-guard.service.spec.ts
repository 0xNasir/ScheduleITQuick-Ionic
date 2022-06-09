import { TestBed } from '@angular/core/testing';

import { AutoLoginGuardService } from './auto-login-guard.service';

describe('AutoLoginGuardService', () => {
  let service: AutoLoginGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoLoginGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
