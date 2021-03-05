/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { TestBed, async, inject } from '@angular/core/testing';

import { cartGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [cartGuard]
    });
  });

  it('should ...', inject([cartGuard], (guard: cartGuard) => {
    expect(guard).toBeTruthy();
  }));
});