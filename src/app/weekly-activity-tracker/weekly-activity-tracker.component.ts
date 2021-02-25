import { Component, OnInit,Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
**/
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}




@Component({
  selector: 'app-weekly-activity-tracker',
  templateUrl: './weekly-activity-tracker.component.html',
  styleUrls: ['./weekly-activity-tracker.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class WeeklyActivityTrackerComponent implements OnInit {

  signupForm:FormGroup;
  tower=['Legacy','MES']

 
 // model2: String;
  constructor(private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }

  ngOnInit(): void {
    this.signupForm=new FormGroup({
      'site':new FormControl(null, Validators.required),
      'task':new FormControl(null,Validators.required),
      'tower':new FormControl(null,Validators.required),
      'details':new FormControl(null),
      'plannedResources':new FormControl(null,Validators.required),
      'responsible':new FormControl(null,Validators.required),
      'status':new FormControl(null,Validators.required),
    });

 
  }
  onSubmit(){
    //console.log(this.signupForm)
    console.log(this.signupForm.get('activityDate').get('model1'))
  
  }


  model1: string;
  model2: string;

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  
}
