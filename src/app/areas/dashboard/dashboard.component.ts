import { ApplicationService } from './../../_services/application.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
  ]
})
export class DashboardComponent implements OnInit {

  constructor(private appService: ApplicationService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();
  }

  ngOnDestroy(): void {
    this.appService.destroyActiveEvent();
  }

}
