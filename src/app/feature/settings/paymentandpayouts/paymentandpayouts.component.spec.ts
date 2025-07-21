import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentandpayoutsComponent } from './paymentandpayouts.component';

describe('PaymentandpayoutsComponent', () => {
  let component: PaymentandpayoutsComponent;
  let fixture: ComponentFixture<PaymentandpayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentandpayoutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentandpayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
