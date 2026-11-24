import { TestBed } from '@angular/core/testing';

import { BlobToJsonInterceptor } from './blob-to-json.interceptor';

describe('BlobToJsonInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BlobToJsonInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BlobToJsonInterceptor = TestBed.inject(BlobToJsonInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
