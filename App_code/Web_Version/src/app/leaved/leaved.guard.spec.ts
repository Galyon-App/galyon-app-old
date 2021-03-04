/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { TestBed, async, inject } from '@angular/core/testing';

import { LeaveGuard } from './leaved.guard';

describe('LeaveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveGuard]
    });
  });

  it('should ...', inject([LeaveGuard], (guard: LeaveGuard) => {
    expect(guard).toBeTruthy();
  }));
});