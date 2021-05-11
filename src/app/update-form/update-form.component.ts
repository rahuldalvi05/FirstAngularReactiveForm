import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { DataStorageService } from '../shared/data-storage.service';
import { Timeline } from '../shared/timeline.model';
import { Update } from './update.model';
import jwt_decode from "jwt-decode";


@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class UpdateFormComponent implements OnInit {
  formid: any;
  data:any;
  dataArr:any;
  resoArr:any;
  respArr:any;
  statArr:any;
  formArr:any;
  token: any;
  id: any;
  public_id: any;
  updates: any;
  update = new Update();
  datafs: any;
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private dataService:DataStorageService,
    private routes: Router
  ) { }

  user:any;
  ngOnInit(): void {
    this.formid=this.route.snapshot.params.id;
    this.update.id = this.formid;
    this.gettowerdata();
    this.getresourcedata();
    this.getrespondata();
    this.getstatusdata();
    this.user=localStorage.getItem('userData');
  console.log(this.user);
    // this.token = localStorage.getItem('x-access-token');
    //   this.id = jwt_decode(this.token);
    //   this.public_id = this.id.id;
    // this.update.public_id = this.public_id;

  }
  gettowerdata()
{
  this.dataService.getTower().subscribe(res=>{
    this.dataArr=res;
  })
}
getresourcedata()
{
  this.dataService.getResource().subscribe(res=>{
    this.resoArr=res;

  })
}
getrespondata()
{
  this.dataService.getResponsible().subscribe(res=>{
    this.respArr=res;
  })
}
getstatusdata()
{
  this.dataService.getStatus().subscribe(res=>{
    this.statArr=res;
  })
}

  getupdatedata()
  {
    this.dataService.updatedata(this.update).subscribe(res =>{
    })
    this.routes.navigate(['/watTable'])
  }
  

}


