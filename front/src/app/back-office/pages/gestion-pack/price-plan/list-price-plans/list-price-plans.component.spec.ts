import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPricePlansComponent } from './list-price-plans.component';

describe('ListPricePlansComponent', () => {
  let component: ListPricePlansComponent;
  let fixture: ComponentFixture<ListPricePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPricePlansComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPricePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
