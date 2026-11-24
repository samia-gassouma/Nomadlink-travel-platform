import { TestBed } from '@angular/core/testing';

import { StatistiquesServiceService } from './statistiques-service.service';

describe('StatistiquesServiceService', () => {
  let service: StatistiquesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatistiquesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
