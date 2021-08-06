import { AuthenticationService } from './../../_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-asidenav',
  templateUrl: './asidenav.component.html',
  styles: [
  ]
})
export class AsidenavComponent implements OnInit {

  constructor(public authService: AuthenticationService, private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
  }

  getUserInfo(userToken: any, request: string): string {
    return this.jwtHelper.decodeToken(userToken.accessToken)[`${request}`];
  }
}
