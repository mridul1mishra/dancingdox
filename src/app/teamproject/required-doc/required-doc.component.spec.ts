import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredDocComponent } from './required-doc.component';

describe('RequiredDocComponent', () => {
  let component: RequiredDocComponent;
  let fixture: ComponentFixture<RequiredDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequiredDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
