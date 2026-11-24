import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MycreatedservicespartnerComponent } from './mycreatedservicespartner.component';

describe('MycreatedservicespartnerComponent', () => {
  let component: MycreatedservicespartnerComponent;
  let fixture: ComponentFixture<MycreatedservicespartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MycreatedservicespartnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MycreatedservicespartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
