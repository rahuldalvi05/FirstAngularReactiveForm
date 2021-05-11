import {  HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn:'root'
})
export class AuthInterceptorService implements HttpInterceptor{

    constructor(private authService: AuthService){

    }
    intercept(req:HttpRequest<any>,next: HttpHandler ){

        // this.authService.user.subscribe(user=>{
        //     let currentUser=user;
        //     if(currentUser && currentUser._token){
        //         req=req.clone(
        //             {
        //                 setHeaders: {
        //                     Authorization: `Bearer ${currentUser._token}`
        //                 }
        //             }
        //         )
        //     }

        // });

        // return next.handle(req);
       
        
        return this.authService.user.pipe(take(1),exhaustMap(user=>{
            if(!user){
                return next.handle(req);
            }
            const modifiedReq=req.clone({
                headers: req.headers.set('X-Access-Token', `${user._token}`),
            })
            return next.handle(modifiedReq);
        }))
       
    }
}