/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClosedComponent } from './closed.component';

describe('ClosedComponent', () => {
  let component: ClosedComponent;
  let fixture: ComponentFixture<ClosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClosedComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
