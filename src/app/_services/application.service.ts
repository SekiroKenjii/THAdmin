import { Injectable } from '@angular/core';

declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor() { }

  handleActiveEvent(): void {
    $(function () {
      var url = window.location;
      $('li.nav-item a').filter(() => {
        if (url.pathname === "/") {
          return this.href == `${url}home`;
        }
        return this.href == url;
      }).addClass('active');
      $('ul.nav-treeview a').filter(function () {
        return this.href == url;
      })
        .parentsUntil(".nav-sidebar > .nav-treeview")
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
}
