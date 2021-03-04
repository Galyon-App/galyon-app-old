/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { ElementRef, Directive, HostListener } from "@angular/core";
@Directive({
    selector: '[parentRemove]'
})
export class ParentRemoveDirective {
    alert_parent: any;
    constructor(private elements: ElementRef) { }

    @HostListener('click', ['$event'])
    onToggle($event: any) {
        $event.preventDefault();
        this.alert_parent = (this.elements).nativeElement.parentElement;
        this.alert_parent.remove();
    }
}