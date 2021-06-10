import { CreateUser } from './../../../_models/userDto';
import { UserService } from './../../../_services/user.service';
import { ApplicationService } from './../../../_services/application.service';
import { Component, OnInit } from '@angular/core';
import { UserVM } from 'src/app/_models/userDto';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  public showSpinner = false;
  public showOverlay = false;

  public uservms = [] as UserVM[];
  public employeeForm = {} as FormGroup;
  public lockEmp = {} as UserVM;
  public unlockEmp = {} as UserVM;
  public saveStage = {} as any;

  public selectedGender: any;
  public selectedRole: any;
  public fileData: File | undefined;
  public previewUrl = '';

  constructor(private empService: UserService, public appService: ApplicationService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();

    this.employeeForm = new FormGroup({
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
      SubRole: new FormControl(null),
    });
    this.getEmployees();
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

  private getEmployees(): void {
    this.showSpinner = true;
    this.empService.getUserByRole('employee').subscribe(
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

  public onAddEmployee(addForm: NgForm): void {
    if (addForm.value.password === '') {
      addForm.value.password = 'THPro0110@Employee'
    }
    if (addForm.value.subRole === 'Admin') {
      addForm.value.role = 'Admin'
      addForm.value.subRole = 'Admin'
    } else {
      addForm.value.role = 'Employee'
    }
    this.showOverlay = true;
    this.empService.addUser(addForm.value).subscribe(
      (response: Response) => {
        console.log(`add employee response with code: ${response.status}`);
        this.toastr.success('Thêm nhân viên thành công!');
        addForm.reset();
        this.getEmployees();
        this.showOverlay = false;
        this.appService.hideModal('addEmployeeModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Thêm nhân viên thất bại!');
      }
    )
  }

  public onUpdateEmployee(data: any): void {
    if (data.SubRole === null) {
      data.SubRole = this.saveStage.SubRole;
    }
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
      if (data.SubRole === this.saveStage.SubRole || this.saveStage.SubRole.includes(data.SubRole)) {
        updateFormData.append('subrole', '');
      } else {
        updateFormData.append('subrole', data.SubRole);
      }
      if (data.Password !== null && data.CurrentPassword !== null) {
        updateFormData.append('newPassword', data.Password);
        updateFormData.append('password', data.CurrentPassword);
      }
      if (this.fileData !== null) {
        updateFormData.append('image', this.fileData!, this.fileData!.name);
      }
      this.empService.updateUser(data.Id, updateFormData).subscribe(
        (response: Response) => {
          console.log(`update employee response with code: ${response.status}`);
          this.toastr.success('Cập nhật nhân viên thành công');
          this.getEmployees();
          this.employeeForm.reset();
          this.showOverlay = false;
          this.appService.hideModal('updateEmployeeModal');
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

  public onLockEmployee(empId: string): void {
    this.showOverlay = true;
    this.empService.lockUser(empId).subscribe(
      (response: Response) => {
        console.log(`lock employee response with code: ${response.status}`);
        this.toastr.success('Khoá nhân viên thành công');
        this.getEmployees();
        this.showOverlay = false;
        this.appService.hideModal('lockEmployeeModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Khoá nhân viên thất bại!');
      }
    );
  }

  public onUnlockEmployee(empId: string): void {
    this.showOverlay = true;
    this.empService.unlockUser(empId).subscribe(
      (response: Response) => {
        console.log(`unlock employee response with code: ${response.status}`);
        this.toastr.success('Mở khoá nhân viên thành công');
        this.getEmployees();
        this.showOverlay = false;
        this.appService.hideModal('unlockEmployeeModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Mở khoá nhân viên thất bại!');
      }
    );
  }

  public onOpenModal(mode: string, emp?: UserVM): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button');
    const dataText = document.getElementById('file-upload-wrapper')!;
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.employeeForm.patchValue({
        Id: emp!.user.id,
        FirstName: emp!.user.firstName,
        LastName: emp!.user.lastName,
        Email: emp!.user.email,
        Username: emp!.user.userName,
        PhoneNumber: emp!.user.phoneNumber,
        Address: emp!.user.address,
        City: emp!.user.city,
        Country: emp!.user.country,
        Gender: emp!.user.gender,
        SubRole: emp!.roles,
      });
      this.fileData = null as any;
      this.saveStage = this.employeeForm.value;
      this.previewUrl = emp!.user.profilePicture;
      dataText.setAttribute('data-text', 'Chọn ảnh mới!');
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'lock') {
      this.employeeForm.reset();
      this.lockEmp = emp!;
      button.setAttribute('data-target', '#lockEmployeeModal');
    }
    if (mode === 'unlock') {
      this.employeeForm.reset();
      this.unlockEmp = emp!;
      button.setAttribute('data-target', '#unlockEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }

}
