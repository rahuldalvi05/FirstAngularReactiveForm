import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn:'root'
})
export class DataStorageService{

    constructor(private http: HttpClient,
        private authService: AuthService
        ){}

    getTower(){
        return this.http.get('http://127.0.0.1:5000/tower');
    }
    getStatus(){
        return this.http.get('http://127.0.0.1:5000/status');

    }

    getResource(){
        return this.http.get('http://127.0.0.1:5000/resource');
    }

    getResponsible(){
        return this.http.get('http://127.0.0.1:5000/responsible');
    }

    createForm(form: FormGroup){
        const formData=form.value
        return this.http.post('http://127.0.0.1:5000/createform',formData);
    }

    updateDate(form: FormGroup){
        const formData=form;
        return this.http.post('http://127.0.0.1:5000/update',formData);
    }

    delete(form: FormGroup){
        const formData=form;
        const id=1;
        return this.http.delete('http://127.0.0.1:5000');
    }

    getWeeklyActivityData(){
        
            return this.http.get('http://127.0.0.1:5000/getWeeklyActivity',{
                //headers: header
            })
        
       // return this.http.get('http://127.0.0.1:5000/getWeeklyActivity');
    }
}