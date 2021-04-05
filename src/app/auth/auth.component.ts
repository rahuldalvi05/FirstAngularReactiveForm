import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode=true;
  isLoading=false;
  error: string=null;

 

  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,

    ) { }

  onSwitchMode():void{
    this.isLoginMode=!this.isLoginMode;
  }
  onSubmit(form: NgForm){

    if(!form.valid){
      return;
    }
    console.log(form.value);
    let authObs: Observable<AuthResponseData>;

    this.isLoading=true;
    if(this.isLoginMode){ 
      authObs = this.authService.login(form.value.email,form.value.password)


    }else{
      authObs= this.authService.signup(form.value.email,form.value.password)
    }
    authObs.subscribe(
      data=>{
        console.log(data);
        this.isLoading=false;
        this.router.navigate(['/watTable']);
      },error=>{
        console.log(error);
        this.error='An error Occured!';
        this.isLoading=false;
        
      }
    )
    
    form.reset()

  }
  ngOnInit(): void {

  }


}
