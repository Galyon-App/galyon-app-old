import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainModalPage } from './main-modal.page';

describe('MainModalPage', () => {
  let component: MainModalPage;
  let fixture: ComponentFixture<MainModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
