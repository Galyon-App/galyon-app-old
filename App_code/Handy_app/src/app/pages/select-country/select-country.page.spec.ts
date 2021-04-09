import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectCountryPage } from './select-country.page';

describe('SelectCountryPage', () => {
  let component: SelectCountryPage;
  let fixture: ComponentFixture<SelectCountryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCountryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCountryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
