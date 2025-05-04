import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigndoctocollabComponent } from './assigndoctocollab.component';

describe('AssigndoctocollabComponent', () => {
  let component: AssigndoctocollabComponent;
  let fixture: ComponentFixture<AssigndoctocollabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigndoctocollabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigndoctocollabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
