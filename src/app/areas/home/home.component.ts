import { ApplicationService } from './../../_services/application.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginMode = false;

  constructor(protected appService: ApplicationService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();
  }

  ngOnDestroy(): void {
    this.appService.destroyActiveEvent();
  }

  loginToggle(): void {
    this.loginMode = !this.loginMode;
  }

  cancelLoginMode(event: boolean) {
    this.loginMode = event;
  }

}
