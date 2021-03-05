/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TopPickedPage } from './top-picked.page';

describe('TopPickedPage', () => {
  let component: TopPickedPage;
  let fixture: ComponentFixture<TopPickedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopPickedPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TopPickedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
