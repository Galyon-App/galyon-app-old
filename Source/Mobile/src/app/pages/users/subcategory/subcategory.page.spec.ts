/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubcategoryPage } from './subcategory.page';

describe('SubCategoryPage', () => {
  let component: SubcategoryPage;
  let fixture: ComponentFixture<SubcategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubcategoryPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubcategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
