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


  pEvent=false;
  upEvent=false;
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
    pTimeline: Timeline[]=[];
    upTimeline: Timeline[]=[];
    
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

      for(i=0;i<this.timeline.length;i++){
        if( this.timeline[i].activityDate < this.currentDate){
          this.pTimeline[i]=this.timeline[i];
        }
        else{
          this.upTimeline[i]=this.timeline[i];
        }
      }

    
      
      this.upTimeline = this.upTimeline.filter(value => Object.keys(value).length !== 0);

      console.log("Previous:");
        console.log(this.pTimeline);
        console.log("Upcoming:");
        console.log(this.upTimeline);


      }

    
      
      
    )

     

    
  }

  onChangeEventPrevious(){
    this.pEvent=!this.pEvent;
    this.upEvent=false;
  }
  onChangeEventUpcoming(){
    this.upEvent=!this.upEvent;
    this.pEvent=false;
  }


  //timelineUser=this.timeLine.userTestStatus;
  


}
