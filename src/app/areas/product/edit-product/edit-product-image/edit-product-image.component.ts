import { EditProductImage, EditProductImageDto } from './../../../../_models/productImageDto';
import { ProductsService } from '../../../../_services/products.service';
import { ProductImage } from '../../../../_models/productImageDto';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationService } from 'src/app/_services/application.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/_services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-product-image',
  templateUrl: './edit-product-image.component.html',
  styleUrls: ['./edit-product-image.component.scss']
})
export class EditProductImageComponent implements OnInit {

  @Input() productImageDetails = {} as EditProductImage
  @Output() closeEditImage = new EventEmitter<any>();

  public prodImages = [] as File[];
  public previewUrl = [] as string[];

  public editProductImageDto = [] as EditProductImageDto[];
  public editProdImages = [] as string[];

  public showOverlay = false;

  constructor(private productImageService: ProductsService, public appService: ApplicationService,
    private toastr: ToastrService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.tryGetEditProductImagePreview();
  }

  public tryGetEditProductImagePreview(): void {
    this.productImageDetails.productImages.forEach(img => {
      this.editProdImages.push(img.imageUrl);
    });
  }

  public editFileProgress(file: any, index: number): void {
    let img = <File>file.target.files[0];
    if (this.editProductImageDto.length === 0 ||
      !this.editProductImageDto.some(x => x.sortOrder === index + 1)) {
      this.editProductImageDto.push({
        sortOrder: index + 1,
        image: img
      });
    } else {
      for (var i = 0; i < this.editProductImageDto.length; i++) {
        if (this.editProductImageDto[i].sortOrder === index + 1) {
          this.editProductImageDto[i] = {
            sortOrder: index + 1,
            image: img
          }
        }
      }
    }
    this.editImagePreview(img, index);
  }

  public editImagePreview(img: File, index: number): void {
    var mimeType = img.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {
      this.editProdImages[index] = reader.result!.toString();
    }
  }

  public fileProgress(fileInput: any): void {
    this.appService.getFileName();
    let imgs = <File[]>fileInput.target.files;
    Array.from(imgs).forEach((file: File) => {
      this.prodImages.push(file);
      this.imagePreview(file);
    })
  }

  private imagePreview(img: File): void {
    var mimeType = img.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = (_event) => {
      this.previewUrl.push(reader.result!.toString());
    }
  }

  public onAddProductImages(productId: number): void {
    this.showOverlay = true;
    let addImageForm = new FormData();
    addImageForm.append('productId', productId.toString())
    for (var i = 0; i < this.prodImages.length; i++) {
      addImageForm.append('images', this.prodImages[i]);
    }
    this.productImageService.addProductImage(addImageForm).subscribe(
      (response: Response) => {
        console.log(`create product images response with code: ${response.status}`);
        this.toastr.success('Th??m m???i ???nh th??nh c??ng');
        this.showOverlay = false;
        this.onCloseEditImage();
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Th??m m???i ???nh th???t b???i');
      }
    );
  }

  public onEditProductImages(): void {
    // this.showOverlay = true;
    let editImageForm = new FormData();
    for (var i = 0; i < this.editProductImageDto.length; i++) {
      editImageForm.append('images', this.editProductImageDto[i].image, this.editProductImageDto[i].sortOrder.toString());
    }
    this.productImageService.updateProductImage(this.productImageDetails.productId, editImageForm).subscribe(
      (response: Response) => {
        console.log(`update product images response with code: ${response.status}`);
        this.toastr.success('C???p nh???t ???nh th??nh c??ng');
        this.showOverlay = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error(error.error, 'C???p nh???t ???nh th???t b???i');
      }
    );
  }

  public onDeleteProductImage(productImage: ProductImage): void {
    this.notification.customNotification.fire({
      title: `B???n c?? ch???c mu???n xo?? ???nh ${productImage.caption}?`,
      text: "B???n s??? kh??ng th??? ph???c h???i l???i ???nh ???? xo??!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.productImageService.deleteProductImage(productImage.id).subscribe(
          (response: Response) => {
            console.log(`delete product images response with code: ${response.status}`);
            this.toastr.success('Xo?? ???nh th??nh c??ng');
            this.showOverlay = false;
          },
          (error: HttpErrorResponse) => {
            console.log(error.error);
            this.showOverlay = false;
            this.toastr.error(error.error, 'Xo?? ???nh th???t b???i');
          }
        );
      }
    });
  }

  public onCloseEditImage(): void {
    this.closeEditImage.emit('close');
  }

}
