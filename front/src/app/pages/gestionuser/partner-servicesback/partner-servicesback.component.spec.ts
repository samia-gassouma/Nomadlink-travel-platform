import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerServicesbackComponent } from './partner-servicesback.component';

describe('PartnerServicesbackComponent', () => {
  let component: PartnerServicesbackComponent;
  let fixture: ComponentFixture<PartnerServicesbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerServicesbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartnerServicesbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
