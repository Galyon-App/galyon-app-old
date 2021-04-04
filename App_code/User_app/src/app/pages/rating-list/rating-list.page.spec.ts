/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RatingListPage } from './rating-list.page';

describe('RatingListPage', () => {
  let component: RatingListPage;
  let fixture: ComponentFixture<RatingListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RatingListPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RatingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
