import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelBotComponent } from './travel-bot.component';

describe('TravelBotComponent', () => {
  let component: TravelBotComponent;
  let fixture: ComponentFixture<TravelBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelBotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
