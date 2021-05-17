/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { TestBed, async, inject } from '@angular/core/testing';

import { SetupAuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetupAuthGuard]
    });
  });

  it('should ...', inject([SetupAuthGuard], (guard: SetupAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});