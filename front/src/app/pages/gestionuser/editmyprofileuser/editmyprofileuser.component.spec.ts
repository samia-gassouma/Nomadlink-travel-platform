import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmyprofileuserComponent } from './editmyprofileuser.component';

describe('EditmyprofileuserComponent', () => {
  let component: EditmyprofileuserComponent;
  let fixture: ComponentFixture<EditmyprofileuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditmyprofileuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditmyprofileuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
