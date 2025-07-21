import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { TeamsComponent } from './teamslist/teams/teams.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationComponent } from './notification/notification.component';
import { TeamDetailsComponent } from './teamslist/team-details/team-details.component';
import { CreateteamsComponent } from './teamslist/createteams/createteams.component';
import { CreateProjectsComponent } from './Projects/create-projects/create-projects.component';
import { GetProjectDetailsComponent } from './Projects/1publicproject/get-project-details.component';
import { ProjectlistComponent } from './teamproject/projectlist/projectlist.component';
import { SettingsComponent } from './feature/settings/settings.component';
import { PersonalinfoComponent } from './feature/settings/personalinfo/personalinfo.component';

import { ProjectdetailsComponent } from './teamproject/projectdetails/projectdetails.component';
import { TeamprojectComponent } from './Projects/teamproject/teamproject.component';
import { IndependentprojectComponent } from './Projects/independentproject/independentproject.component';
import { CreateteaminformationComponent } from './teamlist/createteams/createteaminformation/createteaminformation.component';
import { DocumentInputComponent } from './Projects/2publicproject/document-input.component';
import { TestcomponentComponent } from './testcomponent/testcomponent.component';
import { DynamicprojectdetailsComponent } from './teamproject/dynamicprojectdetails/dynamicprojectdetails.component';
import { CollaboratorComponent } from './Projects/3publicproject/collaborator.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddCollaboratorComponent } from './Projects/add-collaborator/add-collaborator.component';
import { AssigndoctocollabComponent } from './Projects/assigndoctocollab/assigndoctocollab.component';
import { AppComponent } from './app.component';
import { BlankLayoutComponent } from './blank-layout/blank-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthGuard } from './interceptors/auth.guard';
import { WeblayoutComponent } from './weblayout/weblayout.component';
import { HomepageComponent } from './weblayout/homepage/homepage.component';
import { NgModule } from '@angular/core';
import { PasswordresetComponent } from './auth/passwordreset/passwordreset.component';
import { JoinprojectComponent } from './Projects/joinproject/joinproject.component';
import { ColloboratorDocComponent } from './teamproject/colloborator-doc/colloborator-doc.component';
import { EditprojectComponent } from './Projects/editproject/editproject.component';
import { LoginsecurityComponent } from './feature/settings/loginsecurity/loginsecurity.component';
import { PaymentandpayoutsComponent } from './feature/settings/paymentandpayouts/paymentandpayouts.component';
import { PricingplanComponent } from './common/pricingplan/pricingplan.component';


export const routes: Routes = [
    {
    path: '',
    component: WeblayoutComponent,
    children: [
      { path: '', component: HomepageComponent },
      // routes without header/footer
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [AuthGuard], // ✅ Applied here
    children:[
    { path: 'dashboard', component: DashboardComponent },
    { path: 'teams', component: TeamsComponent},
    { path: 'teams/team-details', component: TeamDetailsComponent },
    { path: 'teams/create-teams', component: CreateteamsComponent },
    { path: 'teams/teaminformation', component: CreateteaminformationComponent },
    { path: 'Notification', component: NotificationComponent },
    { path: 'createproject', component: CreateProjectsComponent },
    { path: 'settings', component: SettingsComponent},
    { path: 'pricingplan', component: PricingplanComponent},
    { path: 'settings/payment-and-payouts', component: PaymentandpayoutsComponent},
    
    { path: 'project/createindependentproject/project-start/:id', component: DocumentInputComponent },
    { path: 'projects/projectdetail', component: ProjectdetailsComponent },
    { path: 'projects/:id', component: DynamicprojectdetailsComponent},
    { path: 'projectlist', component: ProjectlistComponent},
    { path: 'settings/personal-info', component: PersonalinfoComponent },
    { path: 'settings/login-security', component: LoginsecurityComponent },
    { path: 'project/createindependentproject/project-start/collaborator/:id', component: CollaboratorComponent},
    { path: 'project/createindependentproject', component: GetProjectDetailsComponent },
    { path: 'project/createprivateproject', component: GetProjectDetailsComponent },
    { path: 'editproject/:id', component: EditprojectComponent },
    { path: 'project/createprivateproject/project-start/assignment/:id', component: AssigndoctocollabComponent },
    { path: 'project/createprivateproject/add-collaborator/:id', component: AddCollaboratorComponent },
    { path: 'project/createprivateproject/project-start/:id', component: DocumentInputComponent },
    { path: 'project/joinproject', component: JoinprojectComponent },
    { path: 'projects/:id/documents', component: ColloboratorDocComponent },

    ]
    },
    {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: 'sign-in', component: LoginComponent },
      { path: 'sign-up', component: RegisterComponent },
      { path: 'reset-password', component: PasswordresetComponent },
      // routes without header/footer
    ]
  },
  
  { path: '**', redirectTo: 'login' }
    
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollOffset: [0, 60], // adjust if you have a fixed header
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}