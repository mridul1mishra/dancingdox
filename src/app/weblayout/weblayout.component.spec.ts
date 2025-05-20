import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeblayoutComponent } from './weblayout.component';

describe('WeblayoutComponent', () => {
  let component: WeblayoutComponent;
  let fixture: ComponentFixture<WeblayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeblayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeblayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
