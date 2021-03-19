import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { WeeklyActivityTrackerComponent } from './weekly-activity-tracker/weekly-activity-tracker.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WatTableComponent } from './wat-table/wat-table.component';
import { AppService } from './app.service';

@NgModule({
  declarations: [
    AppComponent,
    WeeklyActivityTrackerComponent,
    DashboardComponent,
    WatTableComponent,
   
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  exports:[],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
