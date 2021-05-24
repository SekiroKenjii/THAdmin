import { NotificationService } from './../_services/notification.service';
import { AuthenticationService } from './../_services/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserToken } from '../_models/loginDto';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router,
    private jwtHelper: JwtHelperService, private notification: NotificationService) { }

  public async canActivate() {
    const userToken = JSON.parse(localStorage.getItem("userToken")!);
    if (!userToken) {
      this.notification.error("toast", 'Xác thực', null as any);
      this.router.navigateByUrl('/');
      return false;
    } else {
      const token = userToken['accessToken'];
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        return true;
      }
      const isRefreshSuccess = await this.tryRefreshingTokens(token);
      if (!isRefreshSuccess) {
        this.notification.error("toast", 'Xác thực', null as any);
        this.authService.logout();
        this.router.navigateByUrl('/');
      }
      return isRefreshSuccess;
    }
  }

  private async tryRefreshingTokens(token: string): Promise<boolean> {
    const refreshToken: string = JSON.parse(localStorage.getItem("userToken")!)['refreshToken'];
    if (!token || !refreshToken) {
      return false;
    }
    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
    let isRefreshSuccess: boolean = true;
    try {
      const response = await this.authService.refreshToken(credentials).toPromise();
      const newUserToken: UserToken = response;
      localStorage.setItem('userToken', JSON.stringify(newUserToken));
      this.authService.setCurrentUserToken(newUserToken);
      isRefreshSuccess = true;
    } catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }

}
