/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CitiesPage } from './cities.page';

describe('CitiesPage', () => {
  let component: CitiesPage;
  let fixture: ComponentFixture<CitiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CitiesPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
