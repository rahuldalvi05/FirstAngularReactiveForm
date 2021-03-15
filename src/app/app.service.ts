import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class AppService{
    constructor(){}

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
        { site:'rahul', task:5,tower:"rahul", details:"Helli", plannedResources:"mes",responsible:"me",status:'pemding',receivedDate:"2021-2-5", activityDate:"2021-2-5" },
        { site:'rahul', task:5,tower:"rahul", details:"Helli", plannedResources:"mes",responsible:"me",status:'pemding',receivedDate:"2021-2-1", activityDate:"2021-2-1" },
      
      
    ];
}