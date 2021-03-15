import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


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
    private http: HttpClient
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

  finalAcitivityDate: any;
  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    this.finalAcitivityDate = year + "-" + month + "-" + day;
   }

  onSubmit(){
  
    this.signupForm.value['activityDate']=this.finalAcitivityDate;
   // console.log(this.signupForm.value['activityDate'])
   
  }


  // model1: string;
  // model2: string;

  // get today() {
  //   return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  // }
  
}
