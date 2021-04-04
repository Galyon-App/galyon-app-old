/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeliveryOptionsPage } from './delivery-options.page';

describe('DeliveryOptionsPage', () => {
  let component: DeliveryOptionsPage;
  let fixture: ComponentFixture<DeliveryOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryOptionsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
