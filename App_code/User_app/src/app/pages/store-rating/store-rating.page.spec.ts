/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreRatingPage } from './store-rating.page';

describe('StoreRatingPage', () => {
  let component: StoreRatingPage;
  let fixture: ComponentFixture<StoreRatingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StoreRatingPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreRatingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
