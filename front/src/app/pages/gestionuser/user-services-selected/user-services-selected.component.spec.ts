import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserServicesSelectedComponent } from './user-services-selected.component';

describe('UserServicesSelectedComponent', () => {
  let component: UserServicesSelectedComponent;
  let fixture: ComponentFixture<UserServicesSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserServicesSelectedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserServicesSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
