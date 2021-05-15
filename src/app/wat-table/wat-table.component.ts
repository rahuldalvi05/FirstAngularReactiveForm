import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { DataStorageService } from '../shared/data-storage.service';
import { getFormData } from '../shared/getFormData.model';
import { Timeline } from '../shared/timeline.model';

@Component({
  selector: 'app-wat-table',
  templateUrl: './wat-table.component.html',
  styleUrls: ['./wat-table.component.css']
})
export class WatTableComponent implements OnInit {


  popoverTitle = 'Popover title';
  popoverMessage = 'Popover description';
  confirmClicked = false;
  cancelClicked = false;

  constructor(
    private timeLine : AppService,
    private router: Router,
    private dataStorageService: DataStorageService
  ) { }

  userTimeline: Timeline[];
  userData:getFormData[];
  exportData:any;
  private subscription: Subscription;


  ngOnInit(): void {
    this.exportSheetData();
  this.dataStorageService.getWeeklyActivityData().subscribe(
    res=>{
      console.log(res);
      this.userData=res;  
    }
  )
    
  this.userTimeline=this.timeLine.getTimeline();
    
    this.subscription=this.timeLine.timelineChanged.subscribe(
      (timelines: Timeline[])=>{
        this.userTimeline=timelines;

      
      }
    )


    console.log(this.userTimeline);
    
    this.userTimeline.sort(function(a, b){ 

      return new Date(b.activityDate).valueOf() - new Date(a.activityDate).valueOf(); 
  });
    
  }

  clickMethod(name: string) {
    if(confirm("Are you sure to delete "+name)) {
      console.log("Implement delete functionality here");
    }
  }
  deletedata(id)
  {
    
    this.dataStorageService.deldata(id).subscribe(res =>{})
    console.log('Deleted Successfully');
    window.location.reload();
  }

  onEdit(index: number){
    this.timeLine.startedEditing.next(index);
   


  }
  onDelete(index: number){
    this.timeLine.onDelete(index);
  }
  exportSheetData()
  {
    this.dataStorageService.downloaddata().subscribe(res=>{
      this.exportData=res;
    })
  }

  download()
  {
    this.dataStorageService.downloadFile(this.exportData, 'formdata')
  }

 // timelineUser=this.timeLine.userTestStatus;
}
