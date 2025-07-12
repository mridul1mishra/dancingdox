import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxStripeModule, StripeCardComponent, StripeCardCvcComponent, StripeCardExpiryComponent, StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { BrowserModule } from '@angular/platform-browser';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { PaymentService } from '../../service/payment.service';
import { CardData } from '../../service/project.interface.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pricingplan',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule,NgxStripeModule ],
  templateUrl: './pricingplan.component.html',
  styleUrl: './pricingplan.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PricingplanComponent {
  @Input() showPricing = false;
  elementsOptions = {
    locale: 'auto',
    appearance: {
      theme: 'flat',
    },
  } as any;
  constructor(private stripeService: StripeService, private paymentService: PaymentService, private router: Router) {}
   @ViewChild(StripeCardNumberComponent)
  cardNumber!: StripeCardNumberComponent;
onCardFocus() {
  // Hide element with class 'my-class'
  document.querySelectorAll('.is-cardNumber state-pay-visible previous-state-hidden is-card-payment card-is-unknown').forEach(el => {
  (el as HTMLElement).style.display = 'none';
});
}

  @ViewChild(StripeCardExpiryComponent)
  cardExpiry!: StripeCardExpiryComponent;

  @ViewChild(StripeCardCvcComponent)
  cardCvc!: StripeCardCvcComponent;

 selectedPlan: 'personal' | 'team' = 'team';
selectedPayment: string = '';
 cardHolderName = '';
 startPayment: boolean = false;
cardBrand: string = '';

handleCardChange(event: any) {
  document.querySelectorAll('.OffsetContainer').forEach(el => {
  (el as HTMLElement).style.display = 'none';
});
  if (event?.brand) {
    this.cardBrand = event.brand;
  }
}
getCardImage(brand: string): string {
  const brandImages: Record<string, string> = {
    visa: 'https://img.icons8.com/color/48/visa.png',
    mastercard: 'https://img.icons8.com/color/48/mastercard-logo.png',
    amex: 'https://img.icons8.com/color/48/amex.png',
    discover: 'https://img.icons8.com/color/48/discover.png',
    diners: 'https://img.icons8.com/color/48/diners-club.png',
    jcb: 'https://img.icons8.com/color/48/jcb.png',
    unionpay: 'https://img.icons8.com/color/48/unionpay.png',
    unknown: 'https://img.icons8.com/color/48/bank-card-back-side.png'
  };

  return brandImages[brand] || brandImages['unknown'];
}




selectPlan(plan: 'personal' | 'team') {
  this.selectedPlan = plan;
}
startPlan(): void{
  this.startPayment = true;
}
makePayment(): void{
  const stored = JSON.parse(localStorage.getItem('userData') || '{}');
this.stripeService.createPaymentMethod({
  type: 'card',
  card: this.cardNumber.element,
  billing_details: {
    name: this.cardHolderName,
  }
}).subscribe((result) => {
  if (result.paymentMethod) {
    const pm = result.paymentMethod;
    const cardData:CardData = {
    paymentMethodId: pm.id,
    brand: pm.card?.brand || '',
    last4: pm.card?.last4 || '',
    expMonth: pm.card?.exp_month || 0,
    expYear: pm.card?.exp_year || 0,
    billingName: pm.billing_details?.name || ''
    };

    this.paymentService.storeCard(cardData, stored.email).subscribe(() => {
      console.log('Card info stored successfully.');
      this.router.navigate(['/projectlist']);
    });
  } else {
    alert('Error: ' + result.error?.message);
  }
});
}

}
