/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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