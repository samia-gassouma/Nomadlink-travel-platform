import { TestBed } from '@angular/core/testing';

import { TravelQaService } from './travel-qa.service';

describe('TravelQaService', () => {
  let service: TravelQaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelQaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
