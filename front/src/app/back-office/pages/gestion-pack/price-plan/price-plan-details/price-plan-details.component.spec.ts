import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePlanDetailsComponent } from './price-plan-details.component';

describe('PricePlanDetailsComponent', () => {
  let component: PricePlanDetailsComponent;
  let fixture: ComponentFixture<PricePlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricePlanDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PricePlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
