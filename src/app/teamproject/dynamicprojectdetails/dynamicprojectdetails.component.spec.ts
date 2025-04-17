import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicprojectdetailsComponent } from './dynamicprojectdetails.component';

describe('DynamicprojectdetailsComponent', () => {
  let component: DynamicprojectdetailsComponent;
  let fixture: ComponentFixture<DynamicprojectdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicprojectdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicprojectdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
