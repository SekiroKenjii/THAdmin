import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  public customNotification = Swal;

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  private centerAlert = Swal.mixin({
    confirmButtonText: 'Close'
  });

  success(mode: string, text: string) {
    if (mode.toLowerCase() === 'toast') {
      this.Toast.fire({
        icon: 'success',
        title: `${text} thành công!`
      });
    } else if (mode.toLowerCase() === 'center') {
      this.centerAlert.fire({
        icon: 'success',
        title: `${text} thành công`
      });
    } else {
      console.log(`${text} thành công`);
    }
  }

  warning(mode: string, title: string, text?: string) {
    if (mode.toLowerCase() === 'toast') {
      this.Toast.fire({
        icon: 'warning',
        title: title
      });
    } else if (mode.toLowerCase() === 'center') {
      this.centerAlert.fire({
        icon: 'warning',
        title: title,
        html: `<b><u>${text}</u></b>`
      });
    } else {
      console.log(title);
    }
  }

  error(mode: string, title: string, text: HttpErrorResponse) {
    if (mode.toLowerCase() === 'toast') {
      this.Toast.fire({
        icon: 'error',
        title: `${title} thất bại`
      });
    }
    else if (mode.toLowerCase() === 'customtoast') {
      this.Toast.fire({
        icon: 'error',
        title: `${title}`
      });
    } else if (mode.toLowerCase() === 'center' && text.status !== 0) {
      this.centerAlert.fire({
        icon: 'error',
        title: `${title} thất bại!`,
        html: `<b>server response:<b>&nbsp;<u>${text.error}</u>`
      });
    }
    else if (mode.toLowerCase() === 'center' && text.status === 0) {
      this.centerAlert.fire({
        icon: 'error',
        title: `${title} thất bại!`,
        html: `<b>server response:</b>&nbsp;<u>Server is currently down!</u>`
      });
    } else {
      console.log(`${title} thất bại! Server response: ${text.error}`);
    }
  }
}
