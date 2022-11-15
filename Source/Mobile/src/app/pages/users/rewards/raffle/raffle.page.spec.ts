import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RafflePage } from './raffle.page';

describe('RafflePage', () => {
  let component: RafflePage;
  let fixture: ComponentFixture<RafflePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RafflePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RafflePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
