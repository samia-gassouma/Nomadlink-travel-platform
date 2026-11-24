import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyprofilepartnerComponent } from './myprofilepartner.component';

describe('MyprofilepartnerComponent', () => {
  let component: MyprofilepartnerComponent;
  let fixture: ComponentFixture<MyprofilepartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyprofilepartnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyprofilepartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
