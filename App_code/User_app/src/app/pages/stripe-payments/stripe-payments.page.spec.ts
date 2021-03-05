/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StripePaymentsPage } from './stripe-payments.page';

describe('StripePaymentsPage', () => {
  let component: StripePaymentsPage;
  let fixture: ComponentFixture<StripePaymentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StripePaymentsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StripePaymentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
