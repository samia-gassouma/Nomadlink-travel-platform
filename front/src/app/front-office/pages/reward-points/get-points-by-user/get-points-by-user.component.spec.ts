import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPointsByUserComponent } from './get-points-by-user.component';

describe('GetByUserComponent', () => {
  let component: GetPointsByUserComponent;
  let fixture: ComponentFixture<GetPointsByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetPointsByUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetPointsByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
