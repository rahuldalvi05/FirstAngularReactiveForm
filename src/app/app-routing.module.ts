import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { WeeklyActivityTrackerComponent } from "./weekly-activity-tracker/weekly-activity-tracker.component";

const appRoutes: Routes= [
    {path:'', redirectTo:'/',pathMatch:'full'},
    {path:'wat', component:WeeklyActivityTrackerComponent },
    {path:'dashboard',component:DashboardComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
  })
export class AppRoutingModule{

}