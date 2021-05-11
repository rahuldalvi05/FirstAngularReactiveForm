import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Login } from './auth/login.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'weeklyActivityTracker';
  private userSub: Subscription;
  isAuthenticated=false;

  constructor(private authServive: AuthService,
    private appService: AppService,

    ){}
  userName:any;
  user:any;
  ngOnInit():void{
    this.authServive.autoLogin();

    this.user=this.authServive.getUser();

    
     this.userSub= this.authServive.user.subscribe(user=>{
      this.isAuthenticated=!user ? false : true;
      if(this.isAuthenticated){
       this.userName=user.user;
      }
     });

  }

  
  ngOnDestroy():void{
    this.userSub.unsubscribe();
  }

  onLogout(){
    this.authServive.logout();
  }
}
