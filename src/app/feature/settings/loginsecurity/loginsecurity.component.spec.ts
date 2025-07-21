import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginsecurityComponent } from './loginsecurity.component';

describe('LoginsecurityComponent', () => {
  let component: LoginsecurityComponent;
  let fixture: ComponentFixture<LoginsecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginsecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginsecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
