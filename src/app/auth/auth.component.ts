import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthResponseData, AuthService } from './auth.service';
import { Login } from './login.model';
import { Register } from './register.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  register = new Register();
  isLoginMode=true;
  isLoading=false;
  errorMessage: string=null;

 

  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private appService: AppService

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
      const login=new Login(form.value.email,form.value.password);
     // console.log(login);

     

      this.authService.logindata(login).subscribe(

        resData=>{
          console.log("backend")
          console.log(resData)
          this.dataStorageService.userName.next(login.password);
          this.dataStorageService.userName.subscribe(res=>{
            console.log("rahul");
            console.log(res);
          })
          
          this.isLoginMode=false;
          this.router.navigate(['/watTable']);
        
        },error=>{

          this.errorMessage="Invalid Password or username"
          console.log("error msg");
          console.log(error)
          this.isLoading = false;
        }
      );
    }
  
    form.reset()

  }
  ngOnInit(): void {

  }
  data: any;
  message: any;
  status: any;
  confirmpassword: any;
  isActiveArr = [
    {
      "key":"Yes",
      "value":"1"
    },
  ]
 
  signup()
  {

    this.authService.signUpdata(this.register).subscribe(
      resData=>{
        this.isLoginMode=!this.isLoginMode;
        console.log(resData);
        
       this.isLoginMode=!this.isLoginMode;
       if(this.status == 1){
        this.router.navigate(['/auth']);
        }
        }
    )

  }
 


}
