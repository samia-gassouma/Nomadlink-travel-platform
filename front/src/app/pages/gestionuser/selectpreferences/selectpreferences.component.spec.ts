import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectpreferencesComponent } from './selectpreferences.component';

describe('SelectpreferencesComponent', () => {
  let component: SelectpreferencesComponent;
  let fixture: ComponentFixture<SelectpreferencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectpreferencesComponent]
    });
    fixture = TestBed.createComponent(SelectpreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
