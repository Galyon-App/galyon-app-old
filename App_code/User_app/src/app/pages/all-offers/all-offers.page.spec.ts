/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllOffersPage } from './all-offers.page';

describe('AllOffersPage', () => {
  let component: AllOffersPage;
  let fixture: ComponentFixture<AllOffersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllOffersPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllOffersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
