import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterpartnerComponent } from './registerpartner.component';

describe('RegisterpartnerComponent', () => {
  let component: RegisterpartnerComponent;
  let fixture: ComponentFixture<RegisterpartnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterpartnerComponent]
    });
    fixture = TestBed.createComponent(RegisterpartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
