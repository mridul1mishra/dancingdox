import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamprojectComponent } from './teamproject.component';

describe('TeamprojectComponent', () => {
  let component: TeamprojectComponent;
  let fixture: ComponentFixture<TeamprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamprojectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
