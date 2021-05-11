import { Component, NgModule, OnInit } from '@angular/core';
import { AppService,userStatusData } from '../app.service';
import { DataStorageService } from '../shared/data-storage.service';
import { getFormData } from '../shared/getFormData.model';
import { Timeline } from '../shared/timeline.model';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  currentDate=(((new Date()).toISOString()).split('T',1)).toString();
   date:any=[];
  constructor(
    private timeLine: AppService,
    private dataStorageService: DataStorageService,
    //private userStatus: userStatusData
    ) { }

    userData: getFormData[];
    dataObj:getFormData[];
    timeline: Timeline[]=[];
    
  ngOnInit(): void {
    this.dataStorageService.getWeeklyActivityData().subscribe(

      res=>{
  
        this.userData=res; 
   
        let i=0;
        for(let data of this.userData){
          let actDate=data.Activitydate.split(' ',1).toString();
          this.timeline[i]=new Timeline(
            data.site,
            +data.tasknumber,
            data.tower,
            data.Details,
            data.Resources,
            data.Responsible,
            data.status,
            data.Receiveddate,
            actDate
            );
          
          
          i++;
        }  
    
      this.timeline.sort(function(a, b){ 
        return new Date(a.activityDate).valueOf() - new Date(b.activityDate).valueOf(); 
      });

      console.log("After:");
        console.log(this.timeline)

      }

    
      
      
    )

     

    
  }



  timelineUser=this.timeLine.userTestStatus;
  


}
