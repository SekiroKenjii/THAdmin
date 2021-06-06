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
  styleUrls: []
})
export class ProductComponent implements OnInit {

  public products = {} as Product[];
  public productDetails = {} as ProductDetailsViewModel;
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

  private tryGetProductDetails(): void {
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
        text: "Vui lòng kiểm tra lại tệp tin log để biết thêm chi tiết!",
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

  public onOpenModal(product: Product, mode: string): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    container.appendChild(button);
    button.click();
  }

}
