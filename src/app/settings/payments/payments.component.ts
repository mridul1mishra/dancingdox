import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
 // Current Plan Summary
 planName: string = 'Basic Plan';
 billingCycle: string = 'Yearly';
 totalCost: number = 5698;
 usageUsed: number = 12.3;
 usageTotal: number = 15;
 usagePercentage: number = (this.usageUsed / this.usageTotal) * 100;

 // Payment Method
 paymentMethod = {
   type: 'Master Card',
   lastFourDigits: '4002',
   expiryDate: '20/2024',
   email: 'billing@gmail.com'
 };

 // Billing History Data
 billingHistory = [
   {
     product: 'DancingDoc Premium Yearly',
     reference: 'INV-C-2025-700344344',
     amount: 50.06,
     date: '12 JAN 2025',
     status: 'Success'
   },
   {
     product: 'DancingDoc Pro Yearly',
     reference: 'INV-C-2025-660344344',
     amount: 40.06,
     date: '11 JAN 2024',
     status: 'Success'
   },
   {
     product: 'DancingDoc Premium Yearly',
     reference: 'INV-C-2025-120344344',
     amount: 60.06,
     date: '10 JAN 2023',
     status: 'Failed'
   }
 ];
 getStatusClass(status: string): string {
  return status === 'Success' ? 'status-badge status-success' : 'status-badge status-failed';
}
}
