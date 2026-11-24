import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmindestinationComponent } from './admindestination.component';

describe('AdmindestinationComponent', () => {
  let component: AdmindestinationComponent;
  let fixture: ComponentFixture<AdmindestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmindestinationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmindestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
