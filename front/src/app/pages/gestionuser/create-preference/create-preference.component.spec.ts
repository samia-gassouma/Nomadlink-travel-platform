import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePreferenceComponent } from './create-preference.component';

describe('CreatePreferenceComponent', () => {
  let component: CreatePreferenceComponent;
  let fixture: ComponentFixture<CreatePreferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePreferenceComponent]
    });
    fixture = TestBed.createComponent(CreatePreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
