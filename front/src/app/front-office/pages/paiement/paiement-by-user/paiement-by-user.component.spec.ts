import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementByUserComponent } from './paiement-by-user.component';

describe('PaiementByUserComponent', () => {
  let component: PaiementByUserComponent;
  let fixture: ComponentFixture<PaiementByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementByUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
