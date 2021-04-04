/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Directive, HostListener } from '@angular/core';

import * as screenfull from 'screenfull';

@Directive({
  selector: '[appToggleFullscreen]'
})
export class ToggleFullscreenDirective {

  @HostListener('click') onClick() {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
}
