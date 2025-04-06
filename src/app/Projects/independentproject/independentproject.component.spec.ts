import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndependentprojectComponent } from './independentproject.component';

describe('IndependentprojectComponent', () => {
  let component: IndependentprojectComponent;
  let fixture: ComponentFixture<IndependentprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndependentprojectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndependentprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
