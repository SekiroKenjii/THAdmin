import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../../_services/user.service';
import { ApplicationService } from './../../../_services/application.service';
import { Component, OnInit } from '@angular/core';
import { UserVM } from 'src/app/_models/userDto';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  public showSpinner = false;
  public showOverlay = false;

  public uservms = [] as UserVM[];
  public CustomerForm = {} as FormGroup;
  public lockCustomer = {} as UserVM;
  public unlockCustomer = {} as UserVM;
  public saveStage = {} as any;

  public selectedGender: any;
  public fileData: File | undefined;
  public previewUrl = '';

  constructor(public appService: ApplicationService, private customerService: UserService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();
    this.CustomerForm = new FormGroup({
      Id: new FormControl(null),
      FirstName: new FormControl(null),
      LastName: new FormControl(null),
      Email: new FormControl(null),
      Username: new FormControl(null),
      CurrentPassword: new FormControl(null),
      Password: new FormControl(null),
      PhoneNumber: new FormControl(null),
      Address: new FormControl(null),
      City: new FormControl(null),
      Country: new FormControl(null),
      Gender: new FormControl(null),
    });
    this.getCustomers();
  }

  ngOnDestroy(): void {
    this.appService.destroyActiveEvent();
  }

  public fileProgress(fileInput: any): void {
    this.appService.getFileName();
    this.fileData = <File>fileInput.target.files[0];
    if (this.fileData !== null) {
      this.imagePreview();
    } else {
      this.fileData = null as any;
      this.previewUrl = '';
    }
  }

  public imagePreview(): void {
    var mimeType = this.fileData!.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData!);
    reader.onload = (_event) => {
      this.previewUrl = reader.result?.toString()!;
    }
  }

  public onAddCustomer(addForm: NgForm): void {
    if (addForm.value.password === '') {
      addForm.value.password = 'THPro0110@Customer'
    }
    this.showOverlay = true;
    this.customerService.addUser(addForm.value).subscribe(
      (response: Response) => {
        console.log(`add customer response with code: ${response.status}`);
        this.toastr.success('Thêm khách hàng thành công!');
        addForm.reset();
        this.getCustomers();
        this.showOverlay = false;
        this.appService.hideModal('addCustomerModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Thêm khách hàng thất bại!');
      }
    )
  }

  private getCustomers(): void {
    this.showSpinner = true;
    this.customerService.getUserByRole('customer').subscribe(
      (response: UserVM[]) => {
        this.showSpinner = false;
        this.uservms = response;
      },
      (error: HttpErrorResponse) => {
        this.showSpinner = false;
        this.toastr.error(error.error, "Tải dữ liệu thất bại!");
      }
    );
  }

  public onUpdateCustomer(data: any): void {
    if (data.Gender === null || data.Gender < 0) {
      data.Gender = this.saveStage.Gender;
    }
    if (this.appService.isModelChanged(this.saveStage, data) || (data.Password !== '' && data.CurrentPassword !== '') || this.fileData !== null) {
      this.showOverlay = true;
      const updateFormData = new FormData();
      updateFormData.append('firstname', data.FirstName);
      updateFormData.append('lastname', data.LastName);
      updateFormData.append('email', data.Email);
      updateFormData.append('username', data.Username);
      updateFormData.append('phonenumber', data.PhoneNumber);
      updateFormData.append('address', data.Address);
      updateFormData.append('city', data.City);
      updateFormData.append('country', data.Country);
      updateFormData.append('gender', data.Gender);
      if (data.Password !== null && data.CurrentPassword !== null) {
        updateFormData.append('newPassword', data.Password);
        updateFormData.append('password', data.CurrentPassword);
      }
      if (this.fileData !== null) {
        updateFormData.append('image', this.fileData!, this.fileData!.name);
      }
      this.customerService.updateUser(data.Id, updateFormData).subscribe(
        (response: Response) => {
          console.log(`update customer response with code: ${response.status}`);
          this.toastr.success('Cập nhật khách hàng thành công');
          this.getCustomers();
          this.CustomerForm.reset();
          this.showOverlay = false;
          this.appService.hideModal('updateCustomerModal');
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          this.showOverlay = false;
          this.toastr.error(error.error, 'Cập nhật thất bại');
        }
      );
    } else {
      this.toastr.warning('Bạn phải thay đổi giá trị của đối tượng!', 'Chú ý')
    }
  }

  public onLockCustomer(customerId: string): void {
    this.showOverlay = true;
    this.customerService.lockUser(customerId).subscribe(
      (response: Response) => {
        console.log(`lock customer response with code: ${response.status}`);
        this.toastr.success('Khoá khách hàng thành công');
        this.getCustomers();
        this.showOverlay = false;
        this.appService.hideModal('lockCustomerModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Khoá khách hàng thất bại!');
      }
    );
  }

  public onUnlockCustomer(customerId: string): void {
    this.showOverlay = true;
    this.customerService.unlockUser(customerId).subscribe(
      (response: Response) => {
        console.log(`unlock customer response with code: ${response.status}`);
        this.toastr.success('Mở khoá khách hàng thành công');
        this.getCustomers();
        this.showOverlay = false;
        this.appService.hideModal('unlockCustomerModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Mở khoá khách hàng thất bại!');
      }
    );
  }

  public onOpenModal(mode: string, customer?: UserVM): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button');
    const dataText = document.getElementById('file-upload-wrapper')!;
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addCustomerModal');
    }
    if (mode === 'edit') {
      this.CustomerForm.patchValue({
        Id: customer!.user.id,
        FirstName: customer!.user.firstName,
        LastName: customer!.user.lastName,
        Email: customer!.user.email,
        Username: customer!.user.userName,
        PhoneNumber: customer!.user.phoneNumber,
        Address: customer!.user.address,
        City: customer!.user.city,
        Country: customer!.user.country,
        Gender: customer!.user.gender,
      });
      this.fileData = null as any;
      this.saveStage = this.CustomerForm.value;
      this.previewUrl = customer!.user.profilePicture;
      dataText.setAttribute('data-text', 'Chọn ảnh mới!');
      button.setAttribute('data-target', '#updateCustomerModal');
    }
    if (mode === 'lock') {
      this.CustomerForm.reset();
      this.lockCustomer = customer!;
      button.setAttribute('data-target', '#lockCustomerModal');
    }
    if (mode === 'unlock') {
      this.CustomerForm.reset();
      this.unlockCustomer = customer!;
      button.setAttribute('data-target', '#unlockCustomerModal');
    }
    container.appendChild(button);
    button.click();
  }

}
