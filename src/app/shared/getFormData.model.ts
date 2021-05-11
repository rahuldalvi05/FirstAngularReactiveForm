export class getFormData {

    site: string;
    tasknumber: string; 
    tower:string;
    Details: string; 
    Resources: string;
    Responsible: string;
    status: string;
    Receiveddate: string;
    Activitydate:string;
    Id:number;
    constructor(
        site: string,
        task: string, 
        tower:string,
        details: string, 
        plannedResources: string ,
        responsible: string,
        status: string,
        receivedDate: string,
        activityDate:string,
        id:number
    ) {
        this.site=site;
        this.tasknumber=task;
        this.tower=tower;
        this.Details=details;
        this.Resources=plannedResources;
        this.Responsible=responsible;
        this.status=status;
        this.Receiveddate=receivedDate;
        this.Activitydate=activityDate;
    }
  }
  