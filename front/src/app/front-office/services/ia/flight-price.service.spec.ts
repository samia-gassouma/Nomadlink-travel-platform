import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FlightPriceService } from 'src/app/front-office/services/ia/flight-price.service';

describe('FlightPriceService', () => {
  let service: FlightPriceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FlightPriceService]
    });

    service = TestBed.inject(FlightPriceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // You can also add more tests here for the `askGemini` method
});
