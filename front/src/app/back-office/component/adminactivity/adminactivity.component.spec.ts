import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminactivityComponent } from './adminactivity.component';

describe('AdminactivityComponent', () => {
  let component: AdminactivityComponent;
  let fixture: ComponentFixture<AdminactivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminactivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
