/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[cardToggleEvent]'
})
export class CardToggleDirective {
    constructor(private el: ElementRef) { }

    @HostListener('click', ['$event'])
    onToggle($event: any) {
        $event.preventDefault();
        this.el.nativeElement.classList.toggle('icon-up');
    }
}