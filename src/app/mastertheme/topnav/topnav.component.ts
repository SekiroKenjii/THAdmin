import { NotificationService } from './../../_services/notification.service';
import { AuthenticationService } from './../../_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styles: [
  ]
})
export class TopnavComponent implements OnInit {

  constructor(public authService: AuthenticationService, private router: Router,
    private notification: NotificationService) { }

  ngOnInit(): void {
  }

  public logout(): void {
    this.notification.customNotification.fire({
      title: 'Bạn có chắc muốn đăng xuất?',
      text: "Hãy chắc chắn bạn đã lưu công việc của mình!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigateByUrl('/');
      }
    });
  }
}
