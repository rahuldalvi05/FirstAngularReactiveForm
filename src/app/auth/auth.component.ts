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
  error: string=null;

 

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
      console.log(login);

     

      this.authService.logindata(login).subscribe(

        resData=>{
          this.dataStorageService.userName.next(login.password);
          this.dataStorageService.userName.subscribe(res=>{
            console.log("rahul"+res);
          })
          console.log(resData)
          this.isLoginMode=false;
          this.router.navigate(['/watTable']);
          //console.log("Res Data:"+resData);
        }
      );
      
    //  authObs = this.authService.login(form.value.email,form.value.password)
    //   this.authService.logindata(form.value).subscribe(
    //     resData=>{
    //       console.log(resData)
    //     }
    //   );
      

    }else{
     //authObs= this.authService.signup(form.value.email,form.value.password)
    }
    // authObs.subscribe(
    //   data=>{
    //     console.log(data);
    //     this.isLoading=false;
    //     this.router.navigate(['/watTable']);
    //   },error=>{
    //     console.log(error);
    //     this.error='An error Occured!';
    //     this.isLoading=false;
        
    //   }
    // )
    
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
    // this.dataStorageService.userdata(this.register).subscribe((res: any) => {
    //   this.data = res;
    //   console.log(this.register);
    //   console.log(res.status)
    //   this.status = res.status;
    //   this.isLoginMode=!this.isLoginMode;
    //   if(this.status == 1){
    //     this.router.navigate(['/auth']);
    //   }
    //   else{
    //     this.message = this.data.message;
    //   }
    // })
  }
 


}
