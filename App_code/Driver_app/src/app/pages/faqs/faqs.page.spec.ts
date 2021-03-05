/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FaqsPage } from './faqs.page';

describe('FaqsPage', () => {
  let component: FaqsPage;
  let fixture: ComponentFixture<FaqsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FaqsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FaqsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
