import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinprojectComponent } from './joinproject.component';

describe('JoinprojectComponent', () => {
  let component: JoinprojectComponent;
  let fixture: ComponentFixture<JoinprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinprojectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
