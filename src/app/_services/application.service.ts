import { Injectable } from '@angular/core';
import { NgOption } from '@ng-select/ng-select';

declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor() { }

  public StatusOptions: NgOption[] = [
    { value: 0, name: 'InActive' },
    { value: 1, name: 'Active' }
  ];

  public ProductAvailable: NgOption[] = [
    { value: true, name: 'Ngừng kinh doanh' },
    { value: false, name: 'Kinh doanh' }
  ];

  public GenderOptions: NgOption[] = [
    { value: 0, name: 'Nam' },
    { value: 1, name: 'Nữ' },
    { value: 2, name: 'Chưa xác định' }
  ];

  public SubRoleOptions: NgOption[] = [
    { name: "Admin" },
    { name: "Warehouse Staff" },
    { name: "Customer Officer" }
  ];

  handleActiveEvent(): void {
    $(function () {
      var url = window.location;
      $('li.nav-item a').filter(function () {
        if (url.pathname === "/") {
          return this.href == `${url}home`;
        }
        return this.href == url;
      }).addClass('active');
      $('ul.nav-treeview a').filter(function () {
        return this.href == url;
      }).parentsUntil(".nav-sidebar > .nav-treeview")
        .css({ 'display': 'block' })
        .addClass('menu-open').prev('a')
        .addClass('active');
    });
  }

  destroyActiveEvent(): void {
    $(function () {
      $('li.nav-item a').removeClass('active');
      $('ul.nav-treeview a').parentsUntil(".nav-treeview > .nav-sidebar")
        .css({ 'display': '' })
        .removeClass('menu-open').prev('a')
        .removeClass('active');
    });
  }

  hideModal(target: any): void {
    $(`#${target}`).modal('hide');
  }

  isModelChanged(current: any, formValue: any): boolean {
    for (let i in current) {
      if (typeof current[i] !== 'undefined' && typeof formValue[i] !== 'undefined' &&
        current[i] !== null && formValue[i] !== null) {
        if (current[i].toString().trim() !== formValue[i].toString().trim()) {
          return true;
        }
      }
    }
    return false;
  }

  onClickProductThumb(): void {
    $('.product-image-thumb').on('click', function () {
      const image_element = $(this).find('img');
      $('.product-image').prop('src', $(image_element).attr('src'))
      $('.product-image-thumb.active').removeClass('active');
      $(this).addClass('active');
    });
  }

  public getFileName(): void {
    $("form").on("change", ".file-upload-field", function () {
      $(this).parent(".file-upload-wrapper").attr("data-text", $(this).val().replace(/.*(\/|\\)/, ''));
    });
  }
}
