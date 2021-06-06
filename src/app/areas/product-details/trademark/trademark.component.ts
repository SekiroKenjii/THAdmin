import { Trademark } from './../../../_models/productDetailDto';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from 'src/app/_services/application.service';
import { ProductDetailsService } from 'src/app/_services/product-details.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-trademark',
  templateUrl: './trademark.component.html',
  styleUrls: []
})
export class TrademarkComponent implements OnInit {

  public trademarks: Trademark[] | undefined;
  public editTrademark: Trademark | undefined;
  public detailTrademark: Trademark | undefined;
  public deleteTrademark: Trademark | undefined;
  public fileData: File | undefined;
  public previewUrl: any | undefined;
  public previewCreateUrl: any | undefined;
  public showSpinner = false;
  public showOverlay = false;

  constructor(private trademarkService: ProductDetailsService, public appService: ApplicationService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();
    this.getTrademarks();
  }

  ngOnDestroy(): void {
    this.appService.destroyActiveEvent();
  }

  public fileProgress(fileInput: any, mode: string): void {
    this.appService.getFileName();
    this.fileData = <File>fileInput.target.files[0];
    if (this.fileData != null) {
      this.imagePreview(mode);
    } else {
      this.fileData = null as any;
      this.previewUrl = null as any;
      this.previewCreateUrl = null as any;
    }
  }

  public imagePreview(mode: string): void {
    var mimeType = this.fileData?.type;
    if (mimeType?.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData!);
    reader.onload = (_event) => {
      if (mode === 'create') {
        this.previewCreateUrl = reader.result;
      } else {
        this.previewUrl = reader.result;
      }
    }
  }

  private getTrademarks(): void {
    this.showSpinner = true;
    this.trademarkService.getTrademarks().subscribe(
      (response: Trademark[]) => {
        this.showSpinner = false;
        this.trademarks = response;
      },
      (error: HttpErrorResponse) => {
        this.showSpinner = false;
        this.toastr.error(error.error, 'Tải dữ liệu thất bại!');
      }
    );
  }

  public onAddTrademark(addForm: NgForm): void {
    this.showOverlay = true;
    const addFormData = new FormData();
    addFormData.append("name", addForm.value.name);
    addFormData.append("description", addForm.value.description);
    addFormData.append("status", addForm.value.status);
    if (this.fileData !== null) {
      addFormData.append("image", this.fileData!, this.fileData!.name);
    }
    this.trademarkService.addTrademark(addFormData).subscribe(
      (response: Response) => {
        console.log(`create trademark response with code: ${response.status}`);
        this.toastr.success('Thêm mới thành công!');
        addForm.reset();
        this.getTrademarks();
        this.showOverlay = false;
        this.appService.hideModal('addTrademarkModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Thêm mới thất bại!');
      }
    );
  }

  public onUpdateTrademark(trademark: Trademark): void {
    if (this.appService.isModelChanged(this.editTrademark, trademark) || this.fileData !== null) {
      this.showOverlay = true;
      const updateFormData = new FormData();
      updateFormData.append("name", trademark.name);
      updateFormData.append("description", trademark.description);
      updateFormData.append("status", trademark.status.toString());
      if (this.fileData !== null) {
        updateFormData.append("image", this.fileData!, this.fileData!.name);
      }
      this.trademarkService.updateTrademark(trademark.id, updateFormData).subscribe(
        (response: Response) => {
          console.log(`update trademark response with code: ${response.status}`);
          this.toastr.success('Cập nhật thành công!');
          this.getTrademarks();
          this.showOverlay = false;
          this.appService.hideModal('updateTrademarkModal');
        },
        (error: HttpErrorResponse) => {
          console.log(error.status);
          this.showOverlay = false;
          this.toastr.error(error.error, 'Cập nhật thất bại!');
        }
      );
    }
    else {
      this.toastr.warning('Bạn phải thay đổi giá trị của đối tượng!', 'Chú ý');
    }
  }

  public onDeleteTrademark(trademarkId: number): void {
    this.showOverlay = true;
    this.trademarkService.deleteTrademark(trademarkId).subscribe(
      (response: Response) => {
        console.log(`delete trademark response with code: ${response.status}`);
        this.toastr.success('Xoá thành công!');
        this.getTrademarks();
        this.showOverlay = false;
        this.appService.hideModal('deleteTrademarkModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Xoá thất bại!');
      }
    );
  }

  public onOpenModal(trademark: Trademark, mode: string): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      this.previewUrl = null;
      button.setAttribute('data-target', '#addTrademarkModal');
    }
    if (mode === 'edit') {
      this.fileData = null as any;
      this.editTrademark = trademark;
      this.previewUrl = trademark.imageUrl;
      button.setAttribute('data-target', '#updateTrademarkModal');
    }
    if (mode === 'details') {
      this.detailTrademark = trademark;
      button.setAttribute('data-target', '#detailTrademarkModal');
    }
    if (mode === 'delete') {
      this.deleteTrademark = trademark;
      button.setAttribute('data-target', '#deleteTrademarkModal');
    }
    container.appendChild(button);
    button.click();
  }

}
