import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFactureByUserComponent } from './list-facture-by-user.component';

describe('ListFactureByUserComponent', () => {
  let component: ListFactureByUserComponent;
  let fixture: ComponentFixture<ListFactureByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFactureByUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListFactureByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
