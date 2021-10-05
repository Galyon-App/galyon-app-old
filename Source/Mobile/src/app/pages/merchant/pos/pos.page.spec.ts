import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PosPage } from './pos.page';

describe('PosPage', () => {
  let component: PosPage;
  let fixture: ComponentFixture<PosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
