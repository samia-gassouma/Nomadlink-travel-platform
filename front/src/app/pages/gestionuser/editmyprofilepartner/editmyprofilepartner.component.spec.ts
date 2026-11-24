import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmyprofilepartnerComponent } from './editmyprofilepartner.component';

describe('EditmyprofilepartnerComponent', () => {
  let component: EditmyprofilepartnerComponent;
  let fixture: ComponentFixture<EditmyprofilepartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditmyprofilepartnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditmyprofilepartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
