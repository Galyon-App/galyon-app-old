import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private ready: boolean = false;
  public get isReady(): boolean  {
    return this.ready;
  }

  constructor() {
    
  }

  public setTheme(theme = 'light') { //dark
    document.body.setAttribute('color-theme', 'light');
  }

  public setAppReady() {
    this.ready = true;
    document.documentElement.style.setProperty('--background-primary-app', '#ededed');
  }
}
