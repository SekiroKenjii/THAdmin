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

  public trademarks = {} as Trademark[];
  public editTrademark = {} as Trademark;
  public detailTrademark = {} as Trademark;
  public deleteTrademark = {} as Trademark;
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
        this.toastr.error(error.error, 'T???i d??? li???u th???t b???i!');
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
        this.toastr.success('Th??m m???i th??nh c??ng!');
        addForm.reset();
        this.getTrademarks();
        this.showOverlay = false;
        this.appService.hideModal('addTrademarkModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Th??m m???i th???t b???i!');
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
          this.toastr.success('C???p nh???t th??nh c??ng!');
          this.getTrademarks();
          this.showOverlay = false;
          this.appService.hideModal('updateTrademarkModal');
        },
        (error: HttpErrorResponse) => {
          console.log(error.status);
          this.showOverlay = false;
          this.toastr.error(error.error, 'C???p nh???t th???t b???i!');
        }
      );
    }
    else {
      this.toastr.warning('B???n ph???i thay ?????i gi?? tr??? c???a ?????i t?????ng!', 'Ch?? ??');
    }
  }

  public onDeleteTrademark(trademarkId: number): void {
    this.showOverlay = true;
    this.trademarkService.deleteTrademark(trademarkId).subscribe(
      (response: Response) => {
        console.log(`delete trademark response with code: ${response.status}`);
        this.toastr.success('Xo?? th??nh c??ng!');
        this.getTrademarks();
        this.showOverlay = false;
        this.appService.hideModal('deleteTrademarkModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Xo?? th???t b???i!');
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
