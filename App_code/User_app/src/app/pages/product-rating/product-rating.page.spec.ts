/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductRatingPage } from './product-rating.page';

describe('ProductRatingPage', () => {
  let component: ProductRatingPage;
  let fixture: ComponentFixture<ProductRatingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductRatingPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRatingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
