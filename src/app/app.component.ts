import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'weeklyActivityTracker';
  private userSub: Subscription;
  isAuthenticated=false;

  constructor(private authServive: AuthService){}

  ngOnInit():void{
    this.authServive.autoLogin();
     this.userSub= this.authServive.user.subscribe(user=>{
      this.isAuthenticated=!user ? false : true;
     });
  }

  ngOnDestroy():void{
    this.userSub.unsubscribe();
  }

  onLogout(){
    this.authServive.logout();
  }
}
