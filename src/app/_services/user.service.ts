import { CreateUser } from './../_models/userDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role, UserVM } from '../_models/userDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  //ROLE
  addRole(role: Role): Observable<any> {
    return this.http.post<Role>(`${this.apiBaseUrl}/role/add`, role, { observe: 'response' });
  }
  updateRole(roleId: string, role: Role): Observable<any> {
    return this.http.put<Role>(`${this.apiBaseUrl}/role/update/${roleId}`, role, { observe: 'response' });
  }
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete<void>(`${this.apiBaseUrl}/role/delete/${roleId}`, { observe: 'response' });
  }
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/roles`);
  }

  //USER
  getUserByRole(userRole: string): Observable<UserVM[]> {
    return this.http.get<UserVM[]>(`${this.apiBaseUrl}/user/inrole/${userRole}`);
  }

  addUser(user: CreateUser): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/user/add`, user, { observe: 'response' });
  }

  updateUser(userId: string, user: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/user/update/${userId}`, user, { observe: 'response' })
  }

  lockUser(userId: string): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/user/lock/${userId}`, null, { observe: 'response' })
  }

  unlockUser(userId: string): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/user/unlock/${userId}`, null, { observe: 'response' })
  }

}
