import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateteaminformationComponent } from './createteaminformation.component';

describe('CreateteaminformationComponent', () => {
  let component: CreateteaminformationComponent;
  let fixture: ComponentFixture<CreateteaminformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateteaminformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateteaminformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
