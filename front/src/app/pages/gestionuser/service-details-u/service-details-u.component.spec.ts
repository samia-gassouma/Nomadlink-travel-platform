import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailsUComponent } from './service-details-u.component';

describe('ServiceDetailsUComponent', () => {
  let component: ServiceDetailsUComponent;
  let fixture: ComponentFixture<ServiceDetailsUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDetailsUComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceDetailsUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
