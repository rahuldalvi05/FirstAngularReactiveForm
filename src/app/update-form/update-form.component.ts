import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { Timeline } from '../shared/timeline.model';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class UpdateFormComponent implements OnInit {


  signupForm: FormGroup;
  tower=['Legacy','MES'];

  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Timeline;

  constructor(private ngbCalendar: NgbCalendar, 
    private dateAdapter: NgbDateAdapter<string>,
    private http: HttpClient,
    private service: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }
    id: number
  ngOnInit(): void {
  

      this.activatedRoute.params.subscribe(
        params=>{
          this.id=params.id
          this.editMode=true;
        }
      )
      const timeline=this.service.getTimelineEdited(this.id)
      console.log(this.id);
      
        this.signupForm=new FormGroup({
          site:new FormControl(timeline.site, Validators.required),
          task:new FormControl(timeline.task,Validators.required),
          tower:new FormControl(timeline.tower,Validators.required),
          details:new FormControl(timeline.details),
          plannedResources:new FormControl(timeline.plannedResources,Validators.required),
          responsible:new FormControl(timeline.responsible,Validators.required),
          status:new FormControl(timeline.status,Validators.required),
          receivedDate:new FormControl(timeline.receivedDate),
          activityDate:new FormControl(timeline.activityDate)
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

    const value=this.signupForm.value;
    const newTimeline=new Timeline(value.site,value.task,value.tower,value.details,value.plannedResources,value.responsible,value.status,value.receivedDate,value.activityDate);
    this.service.updateTimeline(this.id,newTimeline);
    
    
   // console.log(this.service.getTimeline());
    this.router.navigate(['watTable']);
    
    // this.http.post<any>('http://127.0.0.1:5000/login/add',this.signupForm.value).subscribe(
      
    //   )
  }


  

}


