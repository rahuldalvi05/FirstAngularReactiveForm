import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Timeline } from "./shared/timeline.model";

@Injectable({
    providedIn:'root'
})
export class AppService{
    constructor(){}

    timelineChanged=new Subject<Timeline[]>();

    private timeline: Timeline[]=[
        new Timeline( 'rahul', 1,"xyz", "Hello", "mes","me",'pending',"2021-2-3","2021-2-3"),
        new Timeline( 'omkar', 4,"abc", "Hello", "legacy","me",'pending',"2021-2-5","2021-2-5"),

    ];

    getTimeline(){
        return [...this.timeline];
    }

    addTimeline(timeline: Timeline){
        this.timeline.push(timeline);
        this.timelineChanged.next([...this.timeline]);
    }

    onDelete(index: number){
        this.timeline.splice(index,1);
        this.timelineChanged.next(this.timeline.slice())
    }
    userTestStatus: { 
        site: string,
        task: number, 
        tower:string,
        details: string, 
        plannedResources: string ,
        responsible: string,
        status: string,
        receivedDate: string,
        activityDate:string}[] = [
        { site:'rahul', task:1,tower:"xyz", details:"Hello", plannedResources:"mes",responsible:"me",status:'pending',receivedDate:"2021-2-5", activityDate:"2021-2-5" },
        { site:'omkar', task:2,tower:"abc", details:"Helli", plannedResources:"legacy",responsible:"me",status:'pending',receivedDate:"2021-2-1", activityDate:"2021-2-1" },
      
      
    ];
}