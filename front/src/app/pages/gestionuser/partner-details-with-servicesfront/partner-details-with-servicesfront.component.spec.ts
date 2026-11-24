import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDetailsWithServicesfrontComponent } from './partner-details-with-servicesfront.component';

describe('PartnerDetailsWithServicesfrontComponent', () => {
  let component: PartnerDetailsWithServicesfrontComponent;
  let fixture: ComponentFixture<PartnerDetailsWithServicesfrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerDetailsWithServicesfrontComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartnerDetailsWithServicesfrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
