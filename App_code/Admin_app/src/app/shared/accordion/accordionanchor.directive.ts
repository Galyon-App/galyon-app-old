/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Directive, HostListener, Inject } from '@angular/core';

import { AccordionLinkDirective } from './accordionlink.directive';

@Directive({
  selector: '[appAccordionToggle]'
})
export class AccordionAnchorDirective {

  protected navlink: AccordionLinkDirective;

  constructor(@Inject(AccordionLinkDirective) navlink: AccordionLinkDirective) {
    this.navlink = navlink;
  }

  @HostListener('click', ['$event'])
  onClick(e: any) {
    this.navlink.toggle();
  }
}
