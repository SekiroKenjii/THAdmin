import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/_services/application.service';
import { UserService } from './../../../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Role } from 'src/app/_models/userDto';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: []
})
export class RoleComponent implements OnInit {

  public roles = [] as any[];
  public editRole: any;
  public deleteRole: any;
  public showOverlay = false;
  public showSpinner = false;

  constructor(private roleService: UserService, public appService: ApplicationService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();
    this.getRoles();
  }

  ngOnDestroy(): void {
    this.appService.destroyActiveEvent();
  }

  getRoles(): void {
    this.showSpinner = true;
    this.roleService.getRoles().subscribe(
      (response: any) => {
        this.showSpinner = false;
        this.roles = response;
      },
      (error: HttpErrorResponse) => {
        this.showSpinner = false;
        this.toastr.error(error.error, 'Tải dữ liệu thất bại!');
      }
    );
  }

  onAddRole(addForm: NgForm): void {
    this.showOverlay = true;
    this.roleService.addRole(addForm.value).subscribe(
      (response: Response) => {
        console.log(`add role response with code: ${response.status}`);
        this.toastr.success('Thêm quyền trang web thành công');
        addForm.reset();
        this.getRoles();
        this.showOverlay = false;
        this.appService.hideModal('addRoleModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        addForm.reset();
        this.toastr.error(error.error, 'Thêm mới thất bại!');
      }
    );
  }

  onUpdateRole(role: Role): void {
    if (this.appService.isModelChanged(role, this.editRole)) {
      this.showOverlay = true;
      this.roleService.updateRole(this.editRole.id, role).subscribe(
        (response: Response) => {
          console.log(`update role response with code: ${response.status}`);
          this.toastr.success('Cập nhật quyền thành công');
          this.getRoles();
          this.showOverlay = false;
          this.appService.hideModal('updateRoleModal');
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          this.showOverlay = false;
          this.toastr.error(error.error, 'Cập nhật thất bại!');
        }
      );
    } else {
      this.toastr.warning('Bạn phải thay đổi giá trị của đối tượng!', 'Chú ý');
    }
  }

  onDeleteRole(roleId: string): void {
    this.showOverlay = true;
    this.roleService.deleteRole(roleId).subscribe(
      (response: Response) => {
        console.log(`delete role response with code: ${response.status}`);
        this.toastr.success('Xoá quyền thành công');
        this.getRoles();
        this.showOverlay = false;
        this.appService.hideModal('deleteRoleModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Xoá quyền thất bại!');
      }
    );
  }

  onOpenModal(role: any, mode: string): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button')!;
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addRoleModal');
    }
    if (mode === 'edit') {
      if (role.name === 'Admin') {
        this.toastr.error('Đây là quyền quan trọng nhất của trang web', "Quyền này không khả dụng!");
      }
      else {
        this.editRole = role;
        button.setAttribute('data-target', '#updateRoleModal');
      }
    }
    if (mode === 'delete') {
      if (role.name === 'Admin') {
        this.toastr.error('Đây là quyền quan trọng nhất của trang web', "Quyền này không khả dụng!");
      } else {
        this.deleteRole = role;
        button.setAttribute('data-target', '#deleteRoleModal');
      }
    }
    container.appendChild(button);
    button.click();
  }

}
