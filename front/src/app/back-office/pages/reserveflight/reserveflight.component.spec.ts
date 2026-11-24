import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveflightComponent } from './reserveflight.component';

describe('ReserveflightComponent', () => {
  let component: ReserveflightComponent;
  let fixture: ComponentFixture<ReserveflightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReserveflightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReserveflightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
