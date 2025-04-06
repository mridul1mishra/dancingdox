import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetProjectDetailsComponent } from './get-project-details.component';

describe('GetProjectDetailsComponent', () => {
  let component: GetProjectDetailsComponent;
  let fixture: ComponentFixture<GetProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetProjectDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
