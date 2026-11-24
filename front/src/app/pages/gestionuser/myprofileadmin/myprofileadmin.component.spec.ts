import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyprofileadminComponent } from './myprofileadmin.component';

describe('MyprofileadminComponent', () => {
  let component: MyprofileadminComponent;
  let fixture: ComponentFixture<MyprofileadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyprofileadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyprofileadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
