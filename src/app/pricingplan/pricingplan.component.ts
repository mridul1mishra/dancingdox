import { Component } from '@angular/core';

@Component({
  selector: 'app-pricingplan',
  imports: [],
  templateUrl: './pricingplan.component.html',
  styleUrl: './pricingplan.component.css'
})
export class PricingplanComponent {
  isYearly: boolean = true; // Default to yearly pricing

  personalPlan = {
    name: 'Personal Plan',
    price: 27,
    per: '/month',
    collaborators: 200,
    space: '40 GiB',
    duration: '30 Days',
    teamMode: false,
    teamLimit: false,
    teamMemberType: false,
    teamMemberSize: false,
    costPerTeamMember: false
  };
  teamPlan = {
    name: 'Team Plan',
    price: 27,
    per: '/user/month',
    collaborators: 250,
    space: '50 GiB',
    duration: '30 Days',
    teamMode: true,
    teamLimit: 'Unlimited',
    teamMemberType: 'Paid',
    teamMemberSize: 'Unlimited',
    costPerTeamMember: '$30/month'
  };

  togglePricingMode() {
    this.isYearly = !this.isYearly;
  }
}
