import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientServiceSelectedComponent } from './client-service-selected.component';

describe('ClientServiceSelectedComponent', () => {
  let component: ClientServiceSelectedComponent;
  let fixture: ComponentFixture<ClientServiceSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientServiceSelectedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientServiceSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
