import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdestinationComponent } from './editdestination.component';

describe('EditdestinationComponent', () => {
  let component: EditdestinationComponent;
  let fixture: ComponentFixture<EditdestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditdestinationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditdestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
