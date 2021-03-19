import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { Timeline } from '../shared/timeline.model';

@Component({
  selector: 'app-wat-table',
  templateUrl: './wat-table.component.html',
  styleUrls: ['./wat-table.component.css']
})
export class WatTableComponent implements OnInit {

  constructor(
    private timeLine : AppService
  ) { }

  userTimeline: Timeline[];
  private subscription: Subscription;


  ngOnInit(): void {
  this.userTimeline=this.timeLine.getTimeline();
    
    this.subscription=this.timeLine.timelineChanged.subscribe(
      (timelines: Timeline[])=>{
        console.log(timelines)
        this.userTimeline=timelines;
      
      }
    )

    console.log(this.userTimeline);
    this.userTimeline.sort(function(a, b){ 
      
      return new Date(b.activityDate).valueOf() - new Date(a.activityDate).valueOf(); 
  });
    
  }

  onEdit(index: number){

  }
  onDelete(index: number){
    this.timeLine.onDelete(index);
  }


 // timelineUser=this.timeLine.userTestStatus;
}
