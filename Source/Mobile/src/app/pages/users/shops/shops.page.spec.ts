import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShopsPage } from './shops.page';

describe('ShopsPage', () => {
  let component: ShopsPage;
  let fixture: ComponentFixture<ShopsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
