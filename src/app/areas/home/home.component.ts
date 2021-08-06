import { AuthenticationService } from './../../_services/authentication.service';
import { ApplicationService } from './../../_services/application.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
  ]
})
export class HomeComponent implements OnInit {

  loginMode: boolean = false;

  constructor(private appService: ApplicationService, public authService: AuthenticationService) { }

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
