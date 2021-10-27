import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocatorPage } from './locator.page';

describe('LocatorPage', () => {
  let component: LocatorPage;
  let fixture: ComponentFixture<LocatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocatorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
