import { Injectable } from '@angular/core';
import { version } from '../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public version: string = version;

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
