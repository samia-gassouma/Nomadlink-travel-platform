import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyprofileuserComponent } from './myprofileuser.component';

describe('MyprofileuserComponent', () => {
  let component: MyprofileuserComponent;
  let fixture: ComponentFixture<MyprofileuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyprofileuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyprofileuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
