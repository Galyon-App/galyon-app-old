import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DirectionPage } from './direction.page';

describe('DirectionPage', () => {
  let component: DirectionPage;
  let fixture: ComponentFixture<DirectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DirectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
