import { Demand } from './../../../_models/productDetailDto';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/_services/application.service';
import { ProductDetailsService } from 'src/app/_services/product-details.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html',
  styleUrls: []
})
export class DemandComponent implements OnInit {

  public demands: Demand[] | undefined;
  public editDemand: Demand | undefined;
  public deleteDemand: Demand | undefined;
  public showSpinner = false;
  public showOverlay = false;

  constructor(private demandService: ProductDetailsService, public appService: ApplicationService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();
    this.getDemands();
  }

  ngOnDestroy(): void {
    this.appService.destroyActiveEvent();
  }

  public getDemands(): void {
    this.showSpinner = true;
    this.demandService.getDemands().subscribe(
      (response: Demand[]) => {
        this.showSpinner = false;
        this.demands = response;
      },
      (error: HttpErrorResponse) => {
        this.showSpinner = false;
        this.toastr.error(error.error, 'Tải dữ liệu thất bại!');
      }
    );
  }

  public onAddDemand(addForm: NgForm): void {
    this.showOverlay = true;
    this.demandService.addDemand(addForm.value).subscribe(
      (response: Response) => {
        console.log(`create demand response with code: ${response.status}`);
        this.toastr.success('Thêm mới thành công');
        this.getDemands();
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

  public onUpdateDemand(demand: Demand): void {
    if (this.appService.isModelChanged(this.editDemand, demand)) {
      this.showOverlay = true;
      this.demandService.updateDemand(demand.id, demand).subscribe(
        (response: Response) => {
          console.log(`update demand response with code: ${response.status}`);
          this.toastr.success('Cập nhật thành công');
          this.getDemands();
          this.showOverlay = false;
          this.appService.hideModal('updateDemandModal');
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

  public onDeleteDemand(demandId: number): void {
    this.showOverlay = true;
    this.demandService.deleteDemand(demandId).subscribe(
      (response: Response) => {
        console.log(`delete demand response with code: ${response.status}`);
        this.toastr.success('Xoá thành công');
        this.getDemands();
        this.showOverlay = false;
        this.appService.hideModal('deleteDemandModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error('Xoá thất bại');
      }
    );
  }

  public onOpenModal(demand: Demand, mode: string): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'edit') {
      this.editDemand = demand;
      button.setAttribute('data-target', '#updateDemandModal');
    }
    if (mode === 'delete') {
      this.deleteDemand = demand;
      button.setAttribute('data-target', '#deleteDemandModal');
    }
    container.appendChild(button);
    button.click();
  }

}
