import { TestBed } from '@angular/core/testing';

import { RatesCacheService } from './rates-cache.service';

describe('RatesCacheService', () => {
  let service: RatesCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatesCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
