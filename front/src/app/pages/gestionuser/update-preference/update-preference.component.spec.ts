import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePreferenceComponent } from './update-preference.component';

describe('UpdatePreferenceComponent', () => {
  let component: UpdatePreferenceComponent;
  let fixture: ComponentFixture<UpdatePreferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePreferenceComponent]
    });
    fixture = TestBed.createComponent(UpdatePreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
