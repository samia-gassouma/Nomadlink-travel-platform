import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementproductComponent } from './paiementproduct.component';

describe('PaiementproductComponent', () => {
  let component: PaiementproductComponent;
  let fixture: ComponentFixture<PaiementproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementproductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
