/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TopStoresPage } from './top-stores.page';

describe('TopStoresPage', () => {
  let component: TopStoresPage;
  let fixture: ComponentFixture<TopStoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopStoresPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TopStoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
