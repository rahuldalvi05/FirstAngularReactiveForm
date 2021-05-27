import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbCalendar, NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { DataStorageService } from '../shared/data-storage.service';
import { Timeline } from '../shared/timeline.model';

@Component({
  selector: 'app-weekly-activity-tracker',
  templateUrl: './weekly-activity-tracker.component.html',
  styleUrls: ['./weekly-activity-tracker.component.css'],

})

export class WeeklyActivityTrackerComponent implements OnInit{

  id: number

  dateLimit=new Date().toISOString().split(':',2).join(':');


  
  tower:any;
  responsible:any[]=[];
  resources:any[]=[];
  status:any=[];

  subscription: Subscription;
  editedItemIndex: number;
  editedItem: Timeline;

  constructor(
    private service: AppService,
    private router: Router,
    private dataStorageService: DataStorageService
    ) { }
    signupForm=new FormGroup({
      'site':new FormControl('rahul', Validators.required),
      'public_id':new FormControl('05', Validators.required),
      'task':new FormControl('123',Validators.required),
      'tower':new FormControl('mes',Validators.required),
      'Details':new FormControl('hello'),
      'Resources':new FormControl('legacy',Validators.required),
      'Responsible':new FormControl('mes',Validators.required),
      'status':new FormControl('pending',Validators.required),
      'Receiveddate':new FormControl(null),
      'Activitydate':new FormControl("2021-03-21")
    });


  ngOnInit(): void {

    
    
      this.dataStorageService.getTower().subscribe(
        data=>{
          this.tower=data
          console.log(data);
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
          console.log("res")
          console.log(this.resources);
        }
      )

    this.signupForm=new FormGroup({
      'site':new FormControl('rahul', Validators.required),
      'public_id':new FormControl('05', Validators.required),
      'tasknumber':new FormControl('123',Validators.required),
      'tower':new FormControl('mes',Validators.required),
      'Details':new FormControl('hello'),
      'Resources':new FormControl('legacy',Validators.required),
      'Responsible':new FormControl('mes',Validators.required),
      'status':new FormControl('pending',Validators.required),
      'Receiveddate':new FormControl(null,Validators.required),
      'Activitydate':new FormControl("2021-03-21",Validators.required)
    });

    console.log(this.dateLimit)
  }

 




  onSubmit(){



    const value=this.signupForm.value;
    console.log(value);
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
    
    
    this.dataStorageService.createForm(this.signupForm).subscribe(res=>{
      this.router.navigate(['/watTable']);
    }
      
    );
    // this.http.post<any>('http://127.0.0.1:5000/login/add',this.signupForm.value).subscribe(
      
    //   )

    
  }


  
}
