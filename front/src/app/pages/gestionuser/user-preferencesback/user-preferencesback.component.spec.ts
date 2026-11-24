import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPreferencesbackComponent } from './user-preferencesback.component';

describe('UserPreferencesbackComponent', () => {
  let component: UserPreferencesbackComponent;
  let fixture: ComponentFixture<UserPreferencesbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPreferencesbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPreferencesbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
