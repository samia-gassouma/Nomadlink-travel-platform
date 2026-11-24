import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailsAdminComponent } from './service-details-admin.component';

describe('ServiceDetailsAdminComponent', () => {
  let component: ServiceDetailsAdminComponent;
  let fixture: ComponentFixture<ServiceDetailsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDetailsAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceDetailsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
