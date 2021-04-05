import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { DataStorageService } from '../shared/data-storage.service';
import { Timeline } from '../shared/timeline.model';

@Component({
  selector: 'app-weekly-activity-tracker',
  templateUrl: './weekly-activity-tracker.component.html',
  styleUrls: ['./weekly-activity-tracker.component.css'],

})

export class WeeklyActivityTrackerComponent implements OnInit {


  
  tower:any=[];
  responsible:any[]=[];
  resources:any[]=[];
  status:any=[];

  subscription: Subscription;
  editedItemIndex: number;
  editedItem: Timeline;

  constructor(private ngbCalendar: NgbCalendar, 
    private dateAdapter: NgbDateAdapter<string>,
    private http: HttpClient,
    private service: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataStorageService: DataStorageService
    ) { }
    signupForm=new FormGroup({
      'site':new FormControl('rahul', Validators.required),
      'task':new FormControl('123',Validators.required),
      'tower':new FormControl('mes',Validators.required),
      'details':new FormControl('hello'),
      'plannedResources':new FormControl('legacy',Validators.required),
      'responsible':new FormControl('mes',Validators.required),
      'status':new FormControl('pending',Validators.required),
      'receivedDate':new FormControl("2021-03-24"),
      'activityDate':new FormControl("2021-03-21")
    });

    id: number
  ngOnInit(): void {

    
      this.dataStorageService.getTower().subscribe(
        data=>{
          this.tower[0]=data[0].towername;
          this.tower[1]=data[1].towername;
          //console.log(data[0].towername)
        }
      )
      this.dataStorageService.getResponsible().subscribe(
        data=>{
          for(const [key,value] of Object.entries(data)){
            
            this.responsible.push(value.responname)
          }
        }
      )
        
      this.dataStorageService.getStatus().subscribe(
        data=>{
          for(const [key,value] of Object.entries(data)){
            
            this.status.push(value.statusname)
          }
          //console.log(this.status);
        }
      )

      this.dataStorageService.getResource().subscribe(
        data=>{
          for(const [key,value] of Object.entries(data)){
            
            this.resources.push(value.resourcename)
          }
          //console.log(this.resources);
        }
      )

    this.signupForm=new FormGroup({
      'site':new FormControl('rahul', Validators.required),
      'task':new FormControl('123',Validators.required),
      'tower':new FormControl('mes',Validators.required),
      'details':new FormControl('hello'),
      'plannedResources':new FormControl('legacy',Validators.required),
      'responsible':new FormControl('mes',Validators.required),
      'status':new FormControl('pending',Validators.required),
      'receivedDate':new FormControl("2021-03-24"),
      'activityDate':new FormControl("2021-03-21")
    });
    
  }


  finalDateR: any;
  finalDateA: any;
 

  onDateSelectR(event) {
    console.log(event)
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

    const value=this.signupForm.value;
    const newTimeline=new Timeline(value.site,value.task,value.tower,value.details,value.plannedResources,value.responsible,value.status,value.receivedDate,value.activityDate);
    this.service.addTimeline(newTimeline);
    
    
    // console.log(this.signupForm.value);
    // (this.http.post<any>('http://127.0.0.1:5000/createform/add',this.signupForm.value).subscribe(
    //   res=>(
    //     console.log(res)
    //   )
    // ));

    // this.http.get('http://127.0.0.1:5000/resource').subscribe(
    //   data=>{
    //     console.log(data);
    //   }
    // )
    this.router.navigate(['watTable']);
    
    this.dataStorageService.createForm(this.signupForm);
    // this.http.post<any>('http://127.0.0.1:5000/login/add',this.signupForm.value).subscribe(
      
    //   )

    
  }


  
}
