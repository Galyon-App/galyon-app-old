/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
