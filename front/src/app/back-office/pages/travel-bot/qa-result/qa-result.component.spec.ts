import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaResultComponent } from './qa-result.component';

describe('QaResultComponent', () => {
  let component: QaResultComponent;
  let fixture: ComponentFixture<QaResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QaResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QaResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
