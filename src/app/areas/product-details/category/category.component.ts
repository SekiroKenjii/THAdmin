import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from './../../../_services/application.service';
import { ProductDetailsService } from './../../../_services/product-details.service';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/_models/productDetailDto';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: []
})
export class CategoryComponent implements OnInit {

  public categories: Category[] | undefined;
  public editCategory: Category | undefined;
  public deleteCategory: Category | undefined;
  public showSpinner = false;
  public showOverlay = false;

  constructor(private categoryService: ProductDetailsService, public appService: ApplicationService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.appService.handleActiveEvent();
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.appService.destroyActiveEvent();
  }

  public getCategories(): void {
    this.showSpinner = true;
    this.categoryService.getCategories().subscribe(
      (response: Category[]) => {
        this.showSpinner = false;
        this.categories = response;
      },
      (error: HttpErrorResponse) => {
        this.showSpinner = false;
        this.toastr.error(error.error, 'Tải dữ liệu thất bại!');
      }
    );
  }

  public onAddCategory(addForm: NgForm): void {
    this.showOverlay = true;
    this.categoryService.addCategory(addForm.value).subscribe(
      (response: Response) => {
        console.log(`create category response with code: ${response.status}`);
        this.toastr.success('Thêm mới thành công');
        this.getCategories();
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

  public onUpdateCategory(category: Category): void {
    if (this.appService.isModelChanged(this.editCategory, category)) {
      this.showOverlay = true;
      this.categoryService.updateCategory(category.id, category).subscribe(
        (response: Response) => {
          console.log(`update category response with code: ${response.status}`);
          this.toastr.success('Cập nhật thành công');
          this.getCategories();
          this.showOverlay = false;
          this.appService.hideModal('updateCategoryModal');
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

  public onDeleteCategory(categoryId: number): void {
    this.showOverlay = true;
    this.categoryService.deleteCategory(categoryId).subscribe(
      (response: Response) => {
        console.log(`delete category response with code: ${response.status}`);
        this.toastr.success('Xoá thành công');
        this.getCategories();
        this.showOverlay = false;
        this.appService.hideModal('deleteCategoryModal');
      },
      (error: HttpErrorResponse) => {
        console.log(error.status);
        this.showOverlay = false;
        this.toastr.error('Xoá thất bại');
      }
    )
  }

  public onOpenModal(category: Category, mode: string): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'edit') {
      this.editCategory = category;
      button.setAttribute('data-target', '#updateCategoryModal');
    }
    if (mode === 'delete') {
      this.deleteCategory = category;
      button.setAttribute('data-target', '#deleteCategoryModal');
    }
    container.appendChild(button);
    button.click();
  }

}
