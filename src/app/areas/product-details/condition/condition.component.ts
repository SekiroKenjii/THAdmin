import { Condition } from './../../../_models/productDetailDto';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/_services/application.service';
import { ProductDetailsService } from 'src/app/_services/product-details.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: []
})
export class ConditionComponent implements OnInit {

  public conditions: Condition[] | undefined;
  public editCondition: Condition | undefined;
  public deleteCondition: Condition | undefined;
  public showSpinner = false;
  public showOverlay = false;

  constructor(private conditionService: ProductDetailsService, public appService: ApplicationService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();
    this.getConditions();
  }

  ngOnDestroy(): void {
    this.appService.destroyActiveEvent();
  }

  public getConditions(): void {
    this.showSpinner = true;
    this.conditionService.getConditions().subscribe(
      (response: Condition[]) => {
        this.showSpinner = false;
        this.conditions = response;
      },
      (error: HttpErrorResponse) => {
        this.showSpinner = false;
        this.toastr.error(error.error, 'Tải dữ liệu thất bại!');
      }
    );
  }

  public onAddCondition(addForm: NgForm): void {
    this.showOverlay = true;
    this.conditionService.addCondition(addForm.value).subscribe(
      (response: Response) => {
        console.log(`create condition response with code: ${response.status}`);
        this.toastr.success('Thêm mới thành công');
        this.getConditions();
        addForm.reset();
        this.showOverlay = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.toastr.error(error.error, 'Thêm mới thất bại');
        addForm.reset();
        this.showOverlay = false;
      }
    );
  }

  public onUpdateCondition(condition: Condition): void {
    if (this.appService.isModelChanged(this.editCondition, condition)) {
      this.showOverlay = true;
      this.conditionService.updateCondition(condition.id, condition).subscribe(
        (response: Response) => {
          console.log(`update condition response with code: ${response.status}`);
          this.toastr.success('Cập nhật thành công');
          this.getConditions();
          this.showOverlay = false;
          this.appService.hideModal('updateConditionModal');
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          this.toastr.error(error.error, 'Cập nhật thất bại');
          this.showOverlay = false;
        }
      );
    } else {
      this.toastr.warning('Bạn phải thay đổi giá trị của đối tượng!', 'Chú ý')
    }
  }

  public onDeleteCondition(conditionId: number): void {
    this.showOverlay = true;
    this.conditionService.deleteCondition(conditionId).subscribe(
      (response: Response) => {
        console.log(`delete condition response with code: ${response.status}`);
        this.toastr.success('Xoá thành công');
        this.getConditions();
        this.showOverlay = false;
        this.appService.hideModal('deleteConditionModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
        this.showOverlay = false;
        this.toastr.error('Xoá thất bại');
      }
    )
  }

  public onOpenModal(condition: Condition, mode: string): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'edit') {
      this.editCondition = condition;
      button.setAttribute('data-target', '#updateConditionModal');
    }
    if (mode === 'delete') {
      this.deleteCondition = condition;
      button.setAttribute('data-target', '#deleteConditionModal');
    }
    container.appendChild(button);
    button.click();
  }

}
