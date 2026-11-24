import { SafeUrlPipe } from './safe-url.pipe';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeUrlPipe', () => {
  let domSanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    domSanitizer = TestBed.inject(DomSanitizer);
  });

  it('create an instance', () => {
    const pipe = new SafeUrlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  });
});