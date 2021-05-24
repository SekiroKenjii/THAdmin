import { NgForm } from '@angular/forms';
import { Vendor } from './../../../_models/productDetailDto';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/_services/application.service';
import { ProductDetailsService } from 'src/app/_services/product-details.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: []
})
export class VendorComponent implements OnInit {

  public vendors: Vendor[] | undefined;
  public editVendor: Vendor | undefined;
  public detailVendor: Vendor | undefined;
  public deleteVendor: Vendor | undefined;
  public showSpinner = false;
  public showOverlay = false;

  constructor(private vendorService: ProductDetailsService, public appService: ApplicationService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();
    this.getVendors();
  }

  ngOnDestroy(): void {
    this.appService.destroyActiveEvent();
  }

  private getVendors(): void {
    this.showSpinner = true;
    this.vendorService.getVendors().subscribe(
      (response: Vendor[]) => {
        this.showSpinner = false;
        this.vendors = response;
      },
      (error: HttpErrorResponse) => {
        this.showSpinner = false;
        this.toastr.error(error.error, 'Tải dữ liệu thất bại!');
      }
    );
  }

  public onAddVendor(vendor: NgForm): void {
    this.showOverlay = true;
    this.vendorService.addVendor(vendor.value).subscribe(
      (response: Response) => {
        console.log(`add vendor response with code: ${response.status}`);
        this.toastr.success('Thêm mới thành công!');
        this.getVendors();
        vendor.reset();
        this.showOverlay = false;
        this.appService.hideModal('addVendorModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        vendor.reset();
        this.toastr.error(error.error, 'Thêm mới thất bại!');
      }
    );
  }

  public onUpdateVendor(vendor: Vendor): void {
    if (this.appService.isModelChanged(this.editVendor, vendor)) {
      this.showOverlay = true;
      this.vendorService.updateVendor(vendor.id, vendor).subscribe(
        (response: Response) => {
          console.log(`update vendor response with code: ${response.status}`);
          this.toastr.success('Cập nhật thành công!');
          this.getVendors();
          this.showOverlay = false;
          this.appService.hideModal('updateVendorModal');
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

  public onDeleteVendor(vendorId: number): void {
    this.showOverlay = true;
    this.vendorService.deleteVendor(vendorId).subscribe(
      (response: Response) => {
        console.log(`delete vendor response with code: ${response.status}`);
        this.toastr.success('Xoá thành công!');
        this.getVendors();
        this.showOverlay = false;
        this.appService.hideModal('deleteVendorModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Xoá thất bại!');
      }
    );
  }

  public onOpenModal(vendor: Vendor, mode: string): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addVendorModal');
    }
    if (mode === 'edit') {
      this.editVendor = vendor;
      button.setAttribute('data-target', '#updateVendorModal');
    }
    if (mode === 'details') {
      this.detailVendor = vendor;
      button.setAttribute('data-target', '#detailVendorModal');
    }
    if (mode === 'delete') {
      this.deleteVendor = vendor;
      button.setAttribute('data-target', '#deleteVendorModal');
    }
    container.appendChild(button);
    button.click();
  }
}
