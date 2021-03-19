export class Timeline {

    site: string;
    task: number; 
    tower:string;
    details: string; 
    plannedResources: string;
    responsible: string;
    status: string;
    receivedDate: string;
    activityDate:string;
    constructor(
        site: string,
        task: number, 
        tower:string,
        details: string, 
        plannedResources: string ,
        responsible: string,
        status: string,
        receivedDate: string,
        activityDate:string
    ) {
        this.site=site;
        this.task=task;
        this.tower=tower;
        this.details=details;
        this.plannedResources=plannedResources;
        this.responsible=responsible;
        this.status=status;
        this.receivedDate=receivedDate;
        this.activityDate=activityDate;
    }
  }
  