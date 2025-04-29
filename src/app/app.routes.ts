import { Routes } from '@angular/router';
import { TeamsComponent } from './teamslist/teams/teams.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationComponent } from './notification/notification.component';
import { TeamDetailsComponent } from './teamslist/team-details/team-details.component';
import { CreateteamsComponent } from './teamslist/createteams/createteams.component';
import { CreateProjectsComponent } from './Projects/create-projects/create-projects.component';
import { GetProjectDetailsComponent } from './Projects/1publicproject/get-project-details.component';
import { ProjectlistComponent } from './teamproject/projectlist/projectlist.component';
import { JoinprojectComponent } from './teamproject/joinproject/joinproject.component';
import { SettingsComponent } from './settings/settings.component';
import { PersonalinfoComponent } from './settings/personalinfo/personalinfo.component';
import { PricingplanComponent } from './pricingplan/pricingplan.component';
import { ProjectdetailsComponent } from './teamproject/projectdetails/projectdetails.component';
import { TeamprojectComponent } from './Projects/teamproject/teamproject.component';
import { IndependentprojectComponent } from './Projects/independentproject/independentproject.component';
import { CreateteaminformationComponent } from './teamlist/createteams/createteaminformation/createteaminformation.component';
import { DocumentInputComponent } from './Projects/2publicproject/document-input.component';
import { TestcomponentComponent } from './testcomponent/testcomponent.component';
import { DynamicprojectdetailsComponent } from './teamproject/dynamicprojectdetails/dynamicprojectdetails.component';
import { CollaboratorComponent } from './Projects/3publicproject/collaborator.component';
import { OAuthCallbackComponent } from './oauth-callback/oauth-callback.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';


export const routes: Routes = [
    
    { path: 'teams', component: TeamsComponent },
    { path: 'callback', component: OAuthCallbackComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },    
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'teams/team-details', component: TeamDetailsComponent },
    { path: 'teams/create-teams', component: CreateteamsComponent },
    { path: 'teams/teaminformation', component: CreateteaminformationComponent },
    { path: 'Notification', component: NotificationComponent },
    { path: 'projectslist', component: CreateProjectsComponent },
    { path: 'Settings', component: SettingsComponent },
    { path: 'projects/joinproject', component: JoinprojectComponent },
    { path: 'project/createindependentproject/project-start', component: DocumentInputComponent },
    { path: 'projects/projectdetail', component: ProjectdetailsComponent },
    { path: 'projects/:id', component: DynamicprojectdetailsComponent },
    { path: 'projects', component: ProjectlistComponent },
    { path: 'testpath', component: TestcomponentComponent },
    { path: 'Settings/profile', component: PersonalinfoComponent },
    { path: 'project/createindependentproject/project-start/collaborator', component: CollaboratorComponent },
    { path: 'project/createindependentproject', component: GetProjectDetailsComponent },
    { path: 'pricingplan', component: PricingplanComponent },
    { path: '**', redirectTo: '' } // Wildcard route for 404
];
