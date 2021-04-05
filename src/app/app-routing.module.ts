import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthLoggedGaurd } from "./auth/auth-loggedIn.gaurd";
import { AuthComponent } from "./auth/auth.component";
import { AuthGaurd } from "./auth/auth.gaurd";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UpdateFormComponent } from "./update-form/update-form.component";
import { WatTableComponent } from "./wat-table/wat-table.component";
import { WeeklyActivityTrackerComponent } from "./weekly-activity-tracker/weekly-activity-tracker.component";

const appRoutes: Routes= [
    {path:'', redirectTo:'/auth',pathMatch:'full'},
    {path:'wat',
    canActivate:[AuthGaurd],
    component:WeeklyActivityTrackerComponent },
    {path:'dashboard',
    canActivate:[AuthGaurd],
    component:DashboardComponent},
    {path: 'watTable',
    canActivate:[AuthGaurd],
     component: WatTableComponent},
    {path: 'wat/:id',
    canActivate:[AuthGaurd],
     component: UpdateFormComponent},
    {path:'auth', 
    canActivate:[AuthLoggedGaurd],
    component: AuthComponent}

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
  })
export class AppRoutingModule{

}