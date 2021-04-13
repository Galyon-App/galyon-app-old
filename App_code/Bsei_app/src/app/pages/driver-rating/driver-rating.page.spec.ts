/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DriverRatingPage } from './driver-rating.page';

describe('DriverRatingPage', () => {
  let component: DriverRatingPage;
  let fixture: ComponentFixture<DriverRatingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DriverRatingPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DriverRatingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
