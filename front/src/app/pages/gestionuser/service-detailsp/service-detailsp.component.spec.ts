import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailspComponent } from './service-detailsp.component';

describe('ServiceDetailspComponent', () => {
  let component: ServiceDetailspComponent;
  let fixture: ComponentFixture<ServiceDetailspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDetailspComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceDetailspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
