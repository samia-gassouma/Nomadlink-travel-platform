import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatemyservicespartnerComponent } from './updatemyservicespartner.component';

describe('UpdatemyservicespartnerComponent', () => {
  let component: UpdatemyservicespartnerComponent;
  let fixture: ComponentFixture<UpdatemyservicespartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatemyservicespartnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatemyservicespartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
