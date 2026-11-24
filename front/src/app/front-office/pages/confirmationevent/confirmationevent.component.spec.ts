import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationeventComponent } from './confirmationevent.component';

describe('ConfirmationeventComponent', () => {
  let component: ConfirmationeventComponent;
  let fixture: ComponentFixture<ConfirmationeventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationeventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmationeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
