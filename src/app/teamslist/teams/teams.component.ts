import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Teams {
  title: string;
  totalProjects: number;
  members: number;
  createdOn: string;
  status: string;
  type: string;
}

@Component({
  selector: 'app-teams',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent {
  selectedTab = 'overview';

  teams : Teams[] = [
    {
      title: 'The Interdisciplinary Research and Innovation Consortium',
      totalProjects: 20,
      members: 12,
      createdOn: '4 Oct 24',
      type: 'Research',
      status: 'Active'
    },
    {
      title: 'Cognitive Exploration and Analytical Discovery Alliance',
      totalProjects: 20,
      members: 12,
      createdOn: '4 Oct 24',
      type: 'Seminar',
      status: 'InActive'
    },
    {
      title: 'The Advanced Scholars',
      totalProjects: 20,
      members: 12,
      createdOn: '4 Oct 24',
      type: 'Publication',
      status: 'Active'
    },
  ];
  setTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleTeamStatus(team: any) {
    // Simple example: toggling Active/Inactive
    team.status = team.status === 'Inactive' ? 'Active' : 'Inactive';
  }

}
