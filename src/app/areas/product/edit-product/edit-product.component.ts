import { ProductImage, EditProductImage } from './../../../_models/productImageDto';
import { ApplicationService } from './../../../_services/application.service';
import { Product } from './../../../_models/productDto';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ProductDetailsViewModel } from 'src/app/_models/productDetailDto';
import { ProductDetailsService } from 'src/app/_services/product-details.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/_services/notification.service';
import { ProductsService } from 'src/app/_services/products.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  @Input() product = {} as Product
  @Output() closeEdit = new EventEmitter<any>();

  public productForm = {} as FormGroup;
  public productDetails = {} as ProductDetailsViewModel;
  public productImageDatails = {} as EditProductImage;
  public showSpinner = false;
  public showOverlay = false;
  public openEditImagePage = false;

  constructor(private productDetailService: ProductDetailsService, private productService: ProductsService,
    public appService: ApplicationService, private toastr: ToastrService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.tryGetProductDetails();
  }

  private getProduct(): void {
    this.showSpinner = true;
    this.productService.getProduct(this.product.id).subscribe(
      (response: Product) => {
        this.product = response;
        this.showSpinner = false;
      },
      (error: HttpErrorResponse) => {
        this.showSpinner = false;
        this.toastr.error(error.error, 'Tải dữ liệu thất bại!');
      }
    );
  }

  public tryGetProductDetails(): void {
    try {
      this.productDetailService.getCategories().subscribe(
        categories => this.productDetails.categories = categories
      );
      this.productDetailService.getConditions().subscribe(
        conditions => this.productDetails.conditions = conditions
      );
      this.productDetailService.getDemands().subscribe(
        demands => this.productDetails.demands = demands
      );
      this.productDetailService.getTrademarks().subscribe(
        trademarks => this.productDetails.trademarks = trademarks
      );
      this.productDetailService.getVendors().subscribe(
        vendors => this.productDetails.vendors = vendors
      );
    } catch (ex) {
      this.notification.customNotification.fire({
        title: 'Tải chi tiết sản phẩm bị lỗi!',
        text: "Vui lòng kiểm tra lại tệp tin 'LOG' để biết thêm chi tiết!",
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: `Tải lại`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.tryGetProductDetails();
        }
      });
    }
  }

  public onUpdateProduct(updateForm: NgForm): void {
    if (this.appService.isModelChanged(this.product, updateForm.value)) {
      console.log('changed');
      this.showOverlay = true;
      this.productService.updateProduct(this.product?.id, updateForm.value).subscribe(
        (response: Response) => {
          console.log(`create product response with code: ${response.status}`);
          this.toastr.success('Cập nhật sản phẩm thành công');
          this.showOverlay = false;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          this.showOverlay = false;
          this.toastr.error(error.error, 'Thêm sản phẩm thất bại');
        }
      );
    } else {
      console.log('not change');
      this.toastr.warning('Bạn phải thay đổi giá trị của đối tượng!', 'Chú ý')
    }
  }

  public onCloseEditPage(): void {
    this.closeEdit.emit('closeEditPage');
  }

  public onOpenEditImagePage(product: Product): void {
    this.openEditImagePage = true;
    this.productImageDatails = {
      productId: product.id,
      productName: product.name,
      productImages: product.productImages
    }
  }

  public onCloseEditImagePage(event: any): void {
    if (event === 'close') {
      this.openEditImagePage = false;
      this.getProduct();
    }
  }
}
