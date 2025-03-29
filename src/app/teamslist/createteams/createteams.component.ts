import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-createteams',
  imports: [RouterLink],
  templateUrl: './createteams.component.html',
  styleUrl: './createteams.component.css'
})
export class CreateteamsComponent {
  title = 'My Teams';
  subtitle = 'Manage your teams effortlessly – view, edit, and add members with ease.';
  icon = 'assets/team-icon.png'; // Replace with actual icon path if needed
}
