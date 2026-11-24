import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesanddestinationsComponent } from './activitiesanddestinations.component';

describe('ActivitiesanddestinationsComponent', () => {
  let component: ActivitiesanddestinationsComponent;
  let fixture: ComponentFixture<ActivitiesanddestinationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesanddestinationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivitiesanddestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
