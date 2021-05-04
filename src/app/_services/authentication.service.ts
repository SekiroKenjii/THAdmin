import { UserToken, LoginInfo } from '../_models/loginDto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl = environment.apiBaseUrl;
  private currentUserSource = new ReplaySubject<UserToken>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  authenticate(loginInfo: LoginInfo) {
    return this.http.post<UserToken>(`${this.baseUrl}/Authentication`, loginInfo).pipe(
      map((response: UserToken) => {
        if (response) {
          localStorage.setItem('userToken', JSON.stringify(response));
          this.currentUserSource.next(response);
        }
      })
    );
  }

  setCurrentUserToken(userToken: UserToken) {
    this.currentUserSource.next(userToken);
  }

  logout() {
    localStorage.removeItem('userToken');
    this.currentUserSource.next(null as any);
  }

  refreshToken(creds: any): Observable<UserToken> {
    return this.http.post<UserToken>(`${this.baseUrl}/Token/Refresh`, creds, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    });
  }
}
