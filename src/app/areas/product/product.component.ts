import { NotificationService } from './../../_services/notification.service';
import { ProductDetailsService } from './../../_services/product-details.service';
import { ProductDetailsViewModel } from './../../_models/productDetailDto';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from './../../_services/products.service';
import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/_services/application.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Product } from 'src/app/_models/productDto';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['product.component.scss']
})
export class ProductComponent implements OnInit {

  public products = {} as Product[];
  public editProducts = {} as Product;
  public detailsProduct = {} as Product;
  public deleteProduct = {} as Product;
  public productDetails = {} as ProductDetailsViewModel;
  public partialToggle = '' as string;
  public openEditPage = false;
  public showSpinner = false;
  public showOverlay = false;

  constructor(private productService: ProductsService, private productDetailService: ProductDetailsService,
    public appService: ApplicationService, private toastr: ToastrService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();
    this.tryGetProductDetails();
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.appService.destroyActiveEvent();
  }

  private getProducts(): void {
    this.showSpinner = true;
    this.productService.getProducts().subscribe(
      (response: Product[]) => {
        this.showSpinner = false;
        this.products = response;
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

  public onAddProduct(addForm: NgForm): void {
    this.showOverlay = true;
    this.productService.addProduct(addForm.value).subscribe(
      (response: Response) => {
        console.log(`create product response with code: ${response.status}`);
        this.toastr.success('Thêm sản phẩm mới thành công');
        this.getProducts();
        addForm.reset();
        this.showOverlay = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Thêm sản phẩm thất bại');
      }
    );
  }

  public onDeleteProduct(productId: number): void {
    this.showOverlay = true;
    this.productService.deleteProduct(productId).subscribe(
      (response: Response) => {
        console.log(`delete product response with code: ${response.status}`);
        this.toastr.success('Xoá sản phẩm thành công');
        this.getProducts();
        this.showOverlay = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
        this.showOverlay = false;
        this.toastr.error(error.error, 'Xoá sản phẩm thất bại');
      }
    );
  }

  public onOpenEditPage(product: Product): void {
    this.editProducts = product;
    this.openEditPage = true;
  }

  public onCloseEditPage(event: any): void {
    if (event === 'closeEditPage') {
      this.editProducts = {} as Product;
      this.getProducts();
      this.openEditPage = false;
    }
  }

  public onCloseDetailsPage(target: string): void {
    this.detailsProduct = {} as Product;
    this.appService.hideModal(target);
  }

  public onOpenModal(mode: string, partial?: string, product?: Product): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'create') {
      button.setAttribute('data-target', '#GoodsReceiptModal');
    }
    if (mode === 'openPartialModal') {
      this.partialToggle = partial!;
      button.setAttribute('data-target', '#partialProductDetailsModal');
    }
    if (mode === 'details') {
      this.detailsProduct = product!;
      button.setAttribute('data-target', '#detailsProductModal');
    }
    if (mode === 'delete') {
      this.deleteProduct = product!;
      button.setAttribute('data-target', '#deleteProductModal');
    }
    container.appendChild(button);
    button.click();
  }

}
