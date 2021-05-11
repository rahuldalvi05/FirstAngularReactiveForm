import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { getFormData } from "./getFormData.model";


@Injectable({
    providedIn:'root'
})
export class DataStorageService{

    userName=new Subject<string>();

    constructor(private http: HttpClient,
        private authService: AuthService,
        ){}
        // userToken:any
        // header:any;
        // userData=localStorage.getItem('userData');
        // if(userData){
        //     this.userToken=JSON.parse(this.userData)._token;
        // this.header = new HttpHeaders({
        //     'X-Access-Token' : this.userToken
        //   })

        // }
            

    getTower(){
        return this.http.get('http://127.0.0.1:5000/tower'
        //,{headers: this.header}
        );
    }
    getStatus(){
        return this.http.get('http://127.0.0.1:5000/status'
        // ,{headers: this.header}
        );

    }

    getResource(){
        return this.http.get('http://127.0.0.1:5000/resource'
        // ,{headers: this.header}
        );
    }

    getResponsible(){
        return this.http.get('http://127.0.0.1:5000/responsible'
        // ,{headers: this.header}
        );
    }

    createForm(form: FormGroup){
        const formData=form.value
        return this.http.post('http://127.0.0.1:5000/createform',formData
        // ,{headers: this.header}
        );
    }

    updatedata(data)
  {
    return this.http.post('http://127.0.0.1:5000/update', data);
  }

  deldata(data)
  {
    return this.http.post('http://127.0.0.1:5000/delete', data);
  }
    delete(form: FormGroup){
        const formData=form;
        const id=1;
        return this.http.delete('http://127.0.0.1:5000'
        // ,{headers: this.header}
        );
    }

    userdata(data)
    {
        return this.http.post('http://127.0.0.1:5000/createuser', data
        // ,{headers: this.header}
        );
    }
    getWeeklyActivityData(){
        
            return this.http.get<getFormData[]>('http://127.0.0.1:5000/getdata'
            // ,{headers: this.header}
            )

            // .pipe(
            //     tap(data=>{
            //         this.formDataService.setFormData(data);
            //     }

            //     )
            // )
            // .pipe(
            //     take(1),
            //     map(timeline=>{
            //         return timeline.map( timelines=>{
            //             return {
            //                 ...timeline
            //             }
            //         }

            //         )
            //     }
                    
            //     )
            // )
        
       // return this.http.get('http://127.0.0.1:5000/getWeeklyActivity');
    }
    logindata(data)
  {
    return this.http.post('http://127.0.0.1:5000/login', data);
  }


  
  downloadFile(data, filename='data') {
    let csvData = this.ConvertToCSV(data, ['Activity_date','Activity_time','Details','Received_date','Received_time','Resource','Responsible','public_id','site','status','tasknumber','tower']);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}
ConvertToCSV(objArray, headerList) {
     let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
     let str = '';
     let row = 'id,';
for (let index in headerList) {
         row += headerList[index] + ',';
     }
     row = row.slice(0, -1);
     str += row + '\r\n';
     for (let i = 0; i < array.length; i++) {
         let line = (i+1)+'';
         for (let index in headerList) {
            let head = headerList[index];
line += ',' + array[i][head];
         }
         str += line + '\r\n';
     }
     return str;
 }

 downloaddata()
    {
      return this.http.get('http://127.0.0.1:5000/download');
    }
}