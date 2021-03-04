/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[cardRefresh]'
})
export class CardRefreshDirective {

    constructor(private el: ElementRef) { }
    @HostListener('mouseenter') open() {
        this.el.nativeElement.classList.add('rotate-refresh');
    }

    @HostListener('mouseleave') close() {
        this.el.nativeElement.classList.remove('rotate-refresh');
    }
}