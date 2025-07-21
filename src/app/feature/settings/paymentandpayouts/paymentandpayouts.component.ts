import { Component } from '@angular/core';
import { PaymentService } from '../../../service/payment.service';
import { CardData } from '../../../service/project.interface.service';

@Component({
  selector: 'app-paymentandpayouts',
  imports: [],
  templateUrl: './paymentandpayouts.component.html',
  styleUrl: './paymentandpayouts.component.css'
})
export class PaymentandpayoutsComponent {
// mock data – replace with real values or @Inputs later
  planName     = 'Basic Plan';
  billingCycle = 'Yearly';
  totalCost    = 5698;
  usedGB       = 12.3;
  totalGB      = 15;
  constructor(private paymentService: PaymentService){}
  card: CardData | undefined;
  ngOnInit() {
    const email = localStorage.getItem('userID')
    console.log(email);
    if(email)
    {
      this.paymentService.getPayoutDetails(email).subscribe((res: CardData) => {
        console.log(res);
        this.card =res;
        console.log(this.card);
      });
    }    
  }
  /** percentage for the progress‑bar width */
  get usagePercent(): number {
    return (this.usedGB / this.totalGB) * 100;
  }
}
