/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForgotPage } from './forgot.page';

describe('ForgotPage', () => {
  let component: ForgotPage;
  let fixture: ComponentFixture<ForgotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
