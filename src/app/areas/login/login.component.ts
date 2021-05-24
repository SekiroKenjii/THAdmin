import { NotificationService } from './../../_services/notification.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../_services/authentication.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
  ]
})
export class LoginComponent implements OnInit {

  @Output() cancelLogin = new EventEmitter();

  public showOverlay: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router,
    private notification: NotificationService) { }

  ngOnInit(): void {
  }

  onLogin(loginForm: NgForm): void {
    this.showOverlay = true;
    if (loginForm.controls['rememberMe'].value === '') {
      loginForm.controls['rememberMe'].setValue(false);
    }
    this.authService.authenticate(loginForm.value).subscribe(
      response => {
        this.showOverlay = false;
        this.router.navigateByUrl('/dashboard');
      },
      (error: HttpErrorResponse) => {
        this.showOverlay = false;
        this.notification.error('center', 'Đăng nhập', error);
      }
    );
  }

  cancel() {
    this.showOverlay = false;
    this.cancelLogin.emit(false);
  }

}
