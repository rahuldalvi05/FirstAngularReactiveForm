import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { WeeklyActivityTrackerComponent } from './weekly-activity-tracker/weekly-activity-tracker.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WatTableComponent } from './wat-table/wat-table.component';
import { AppService } from './app.service';
import { UpdateFormComponent } from './update-form/update-form.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinner } from './shared/loading/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { TippyModule } from '@ngneat/helipopper';

@NgModule({
  declarations: [
    AppComponent,
    WeeklyActivityTrackerComponent,
    DashboardComponent,
    WatTableComponent,
    UpdateFormComponent,
    AuthComponent,
    LoadingSpinner,   
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
  providers: [AppService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:AuthInterceptorService,
      multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
