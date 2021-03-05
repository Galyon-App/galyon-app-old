/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
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