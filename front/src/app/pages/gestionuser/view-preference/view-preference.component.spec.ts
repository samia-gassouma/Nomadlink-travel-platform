import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPreferenceComponent } from './view-preference.component';

describe('ViewPreferenceComponent', () => {
  let component: ViewPreferenceComponent;
  let fixture: ComponentFixture<ViewPreferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPreferenceComponent]
    });
    fixture = TestBed.createComponent(ViewPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
