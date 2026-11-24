import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRewardPointsComponent } from './update-reward-points.component';

describe('UpdateRewardPointsComponent', () => {
  let component: UpdateRewardPointsComponent;
  let fixture: ComponentFixture<UpdateRewardPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRewardPointsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateRewardPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
