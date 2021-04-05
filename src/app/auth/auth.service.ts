import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { User } from "./user.model";
import { map, tap } from 'rxjs/operators';
import { Router } from "@angular/router";

export interface AuthResponseData{
    
    idToken: string;
    email:string;
    refreshToken:string;
    expiresIn: string;
    localId: string;
    registered?:boolean;
}

@Injectable({
    providedIn:'root'
})
export class AuthService{
    //user=new Subject<User>();
    user=new BehaviorSubject<User>(null);
    token:string=null;
    private tokenExpirationTimer:any;
    loggedInuser=false;

    private currentUserSubject: BehaviorSubject<AuthResponseData>;
    public currentUser: Observable<AuthResponseData>;

    constructor(
        private http: HttpClient,
        private router: Router
        ){}

    public get currentUserValue(): AuthResponseData {
        return this.currentUserSubject.value;
    }

    signup(email: string, password: string){
     return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCwMu8y-W90nj0YgcCpDISsBj7M94wekBw',{
            email: email,
            password:password,
            returnSecureToken:true
        }).pipe(
            tap(
                resData=>{
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn
                    )
                
                }
            )
        )
    }


   
    login(email: string, password:string){
       
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCwMu8y-W90nj0YgcCpDISsBj7M94wekBw',{
            email: email,
            password:password,
            returnSecureToken:true
        }).pipe(
            tap(
                resData=>{
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn)
                
                }
            )
        )
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer=null;
    }

    autoLogin(){
        const userData:{
            email:string;
            id: string;
            _token:string;
            _tokenExpirationDate: string;
        }= JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return;
        }

        const loadedUser=new User(userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate
        ));
        if(loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration=new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDate: number){
        this.tokenExpirationTimer= setTimeout(()=>{
            this.logout();
        },expirationDate)
    }

    private handleAuthentication(email: string, userId:string, token: string, expiresIn: number){
        const expirationDate=new Date(new Date().getTime() + expiresIn*1000)
        const user=new User(email,userId,token,expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn*1000);    
        localStorage.setItem('userData',JSON.stringify(user))
    }
}   