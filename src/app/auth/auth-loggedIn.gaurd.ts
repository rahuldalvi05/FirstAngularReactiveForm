import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn:'root'
})
export class AuthLoggedGaurd implements CanActivate{
    constructor(
        private authService: AuthService,
        private router: Router
    ){}

    canActivate(
        route: ActivatedRouteSnapshot,
        routerState: RouterStateSnapshot
        ): 
        | boolean 
        | UrlTree
        | Promise<boolean> 
        | Observable<boolean | UrlTree > {
            return this.authService.user.pipe(
                take(1),
                map(
                user=>{
                    const isAuth=!!user;
                    if(!isAuth){
                        return true;
                    }
                    return this.router.createUrlTree(['/watTable']);
                }
            )
            );
    }
}