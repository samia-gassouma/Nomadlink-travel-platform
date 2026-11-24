import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPricePlanComponent } from './add-price-plan.component';

describe('AddPricePlanComponent', () => {
  let component: AddPricePlanComponent;
  let fixture: ComponentFixture<AddPricePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPricePlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPricePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
