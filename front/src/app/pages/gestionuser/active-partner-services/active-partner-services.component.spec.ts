import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePartnerServicesComponent } from './active-partner-services.component';

describe('ActivePartnerServicesComponent', () => {
  let component: ActivePartnerServicesComponent;
  let fixture: ComponentFixture<ActivePartnerServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivePartnerServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivePartnerServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
