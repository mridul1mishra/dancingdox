import { Component } from '@angular/core';

@Component({
  selector: 'app-team-details',
  imports: [],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.css'
})
export class TeamDetailsComponent {
  researchTeam = {
    name: 'The Interdisciplinary Research and Innovation Consortium',
    totalProjects: 20,
    members: 12,
    type: 'Research',
    author: 'Jamil Hossain',
    createdOn: '4 Oct 2024',
    description: 'The Interdisciplinary Research and Innovation Consortium (IRIC) is a collaborative academic team dedicated to exploring new frontiers of knowledge through in-depth research, data-driven insights, and interdisciplinary collaboration. The team consists of scholars, researchers, and professionals from diverse fields, working together to solve complex real-world problems and contribute to academic advancements.'
  };
}
