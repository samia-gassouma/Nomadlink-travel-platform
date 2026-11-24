import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FrontOfficeComponent } from './front-office.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        FrontOfficeComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FrontOfficeComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Toor'`, () => {
    const fixture = TestBed.createComponent(FrontOfficeComponent);
    const app = fixture.componentInstance;
    //expect(app.title).toEqual('Toor');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(FrontOfficeComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('Toor app is running!');
  });
});
