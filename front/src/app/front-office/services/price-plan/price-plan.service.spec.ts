import { TestBed } from '@angular/core/testing';

import { PricePlanService } from './price-plan.service';

describe('PricePlanService', () => {
  let service: PricePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PricePlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
