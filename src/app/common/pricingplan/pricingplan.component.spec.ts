import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingplanComponent } from './pricingplan.component';

describe('PricingplanComponent', () => {
  let component: PricingplanComponent;
  let fixture: ComponentFixture<PricingplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingplanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
