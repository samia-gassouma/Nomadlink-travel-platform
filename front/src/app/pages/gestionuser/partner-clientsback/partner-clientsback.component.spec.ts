import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerClientsbackComponent } from './partner-clientsback.component';

describe('PartnerClientsbackComponent', () => {
  let component: PartnerClientsbackComponent;
  let fixture: ComponentFixture<PartnerClientsbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerClientsbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartnerClientsbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
