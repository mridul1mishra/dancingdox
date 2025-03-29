import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateteamsComponent } from './createteams.component';

describe('CreateteamsComponent', () => {
  let component: CreateteamsComponent;
  let fixture: ComponentFixture<CreateteamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateteamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateteamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
