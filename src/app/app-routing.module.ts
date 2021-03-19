import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { WatTableComponent } from "./wat-table/wat-table.component";
import { WeeklyActivityTrackerComponent } from "./weekly-activity-tracker/weekly-activity-tracker.component";

const appRoutes: Routes= [
    {path:'', redirectTo:'/',pathMatch:'full'},
    {path:'wat', component:WeeklyActivityTrackerComponent },
    {path:'dashboard',component:DashboardComponent},
    {path: 'watTable', component: WatTableComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
  })
export class AppRoutingModule{

}