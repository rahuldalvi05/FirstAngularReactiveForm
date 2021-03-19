import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../app.service';
import { Timeline } from '../shared/timeline.model';


@Component({
  selector: 'app-weekly-activity-tracker',
  templateUrl: './weekly-activity-tracker.component.html',
  styleUrls: ['./weekly-activity-tracker.component.css'],

})

export class WeeklyActivityTrackerComponent implements OnInit {


  signupForm:FormGroup;
  tower=['Legacy','MES']

  //site: string
 // model2: String;
  constructor(private ngbCalendar: NgbCalendar, 
    private dateAdapter: NgbDateAdapter<string>,
    private http: HttpClient,
    private service: AppService,
    private router: Router
    ) { }

  ngOnInit(): void {



    this.signupForm=new FormGroup({
      'site':new FormControl(null, Validators.required),
      'task':new FormControl(null,Validators.required),
      'tower':new FormControl(null,Validators.required),
      'details':new FormControl(null),
      'plannedResources':new FormControl(null,Validators.required),
      'responsible':new FormControl(null,Validators.required),
      'status':new FormControl(null,Validators.required),
      'receivedDate':new FormControl(null),
      'activityDate':new FormControl(null)
    });

    

 
  }

  finalDateR: any;
  finalDateA: any;
 

  onDateSelectR(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    this.finalDateR = year + "-" + month + "-" + day;
   }
   onDateSelectA(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    this.finalDateA = year + "-" + month + "-" + day;
   }
   

  onSubmit(){
  
    this.signupForm.value['activityDate']=this.finalDateA;
    this.signupForm.value['receivedDate']=this.finalDateR;


    // this.http.post<any>(' http://127.0.0.1:5000/createform',this.signupForm.value).subscribe(
    //   response=>{
    //     console.log(response)
    //   }
    // )

    const value=this.signupForm.value;
    const newTimeline=new Timeline(value.site,value.task,value.tower,value.details,value.plannedResources,value.responsible,value.status,value.receivedDate,value.activityDate);
    this.service.addTimeline(newTimeline);
    console.log(this.service.getTimeline())
    this.router.navigate(['watTable']);
  }


  // model1: string;
  // model2: string;

  // get today() {
  //   return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  // }
  
}
