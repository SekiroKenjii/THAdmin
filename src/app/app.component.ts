import { AuthenticationService } from './_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { UserToken } from './_models/loginDto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'THAdmin';

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userToken: UserToken = JSON.parse(localStorage.getItem('userToken')!);
    this.authService.setCurrentUserToken(userToken);
  }
}
