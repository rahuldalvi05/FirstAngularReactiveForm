import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private timeLine: AppService) { }

  ngOnInit(): void {
    console.log(this.timelineUser);
    this.timelineUser.sort(function(a, b){ 
      
      return new Date(b.activityDate).valueOf() - new Date(a.activityDate).valueOf(); 
  });
  }

  timelineUser=this.timeLine.userTestStatus;
  


}
